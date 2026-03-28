const express = require('express');
const app = express();
let { ticketCustomer } = require('./models/ticketCustomer.model');
let { ticketAgent } = require('./models/ticketAgent.model');
let { ticket } = require('./models/ticket.model');
let { customer } = require('./models/customer.model');
let { agent } = require('./models/agent.model');
let { sequelize } = require('./lib/index');
let { Op } = require('@sequelize/core');

app.get('/seed_db', async (req, res) => {
  await sequelize.sync({ force: true });

  let tickets = await ticket.bulkCreate([
    {
      ticketId: 1,
      title: 'Login Issue',
      description: 'Cannot login to account',
      status: 'open',
      priority: 1,
      customerId: 1,
      agentId: 1,
    },
    {
      ticketId: 2,
      title: 'Payment Failure',
      description: 'Payment not processed',
      status: 'closed',
      priority: 2,
      customerId: 2,
      agentId: 2,
    },
    {
      ticketId: 3,
      title: 'Bug Report',
      description: 'Found a bug in the system',
      status: 'open',
      priority: 3,
      customerId: 1,
      agentId: 1,
    },
  ]);

  let customers = await customer.bulkCreate([
    { customerId: 1, name: 'Alice', email: 'alice@example.com' },
    { customerId: 2, name: 'Bob', email: 'bob@example.com' },
  ]);

  let agents = await agent.bulkCreate([
    { agentId: 1, name: 'Charlie', email: 'charlie@example.com' },
    { agentId: 2, name: 'Dave', email: 'dave@example.com' },
  ]);

  await ticketCustomer.bulkCreate([
    { ticketId: tickets[0].id, customerId: customers[0].id },
    { ticketId: tickets[2].id, customerId: customers[0].id },
    { ticketId: tickets[1].id, customerId: customers[1].id },
  ]);

  await ticketAgent.bulkCreate([
    { ticketId: tickets[0].id, agentId: agents[0].id },
    { ticketId: tickets[2].id, agentId: agents[0].id },
    { ticketId: tickets[1].id, agentId: agents[1].id },
  ]);

  return res.json({ message: 'Database seeded successfully' });
});

// Helper function to get ticket's associated customers
async function getTicketCustomers(ticketId) {
  const ticketCustomers = await ticketCustomer.findAll({
    where: { ticketId },
  });

  let customerData;
  for (let cus of ticketCustomers) {
    customerData = await customer.findOne({where :{customerId: cus.customerId}});
  }

  return customerData;
}

async function getTicketAgents(ticketId) {
  const ticketAgents = await ticketAgent.findAll({
    where: { ticketId },
  });

  let agentData;
  for (let agt of ticketAgents) {
    agentData = await agent.findOne({where :{agentId: agt.agentId}});
  }

  return agentData;
}
// Helper function to get ticket details with associated customers and agents
async function getTicketDetails(ticketData) {
  const customer = await getTicketCustomers(ticketData.id);
  const agent = await getTicketAgents(ticketData.id);

  return {
    ...ticketData.dataValues,
    customer,
    agent,
  };
}

async function getAllTickets() {
  let allTickets = await ticket.findAll();
  let allTicketDetails = [];

  for(let ticketData of allTickets){
      const ticketDetail = await getTicketDetails(ticketData)
      allTicketDetails.push(ticketDetail);
  }

  return({tickets: allTicketDetails})

}
app.get('/tickets', async (req, res) => {
  try {

    let response = await getAllTickets();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


async function fetchTicketById(id) {
  let TicketsOfGivenId = await ticket.findOne({ where: { id } });
  let allTicketDetails = [];

  
      const ticketDetail = await getTicketDetails(TicketsOfGivenId)
      allTicketDetails.push(ticketDetail);
  

  return({tickets: allTicketDetails})

}
app.get('/tickets/details/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let response = await fetchTicketById(id);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


async function fetchTicketByStatus(status) {
  let TicketsOfGivenStatus = await ticket.findAll({ where: { status } });
  let allTicketDetails = [];

  for( let ticketData of TicketsOfGivenStatus){

    const ticketDetail = await getTicketDetails(ticketData)
    allTicketDetails.push(ticketDetail);

  }
  

  return({tickets: allTicketDetails})

}
app.get('/tickets/status/:status', async (req, res) => {
  try {
    let status = req.params.status;
    let response = await fetchTicketByStatus(status);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchTicketByPriorityInSortedOrder() {
  let TicketsOfGivenStatus = await ticket.findAll({ order: [['priority', 'ASC']] });
  let allTicketDetails = [];

  for( let ticketData of TicketsOfGivenStatus){

    const ticketDetail = await getTicketDetails(ticketData)
    allTicketDetails.push(ticketDetail);
    
  }
  

  return({tickets: allTicketDetails})

}
app.get('/tickets/sort-by-priority', async (req, res) => {
  try {

    let response = await fetchTicketByPriorityInSortedOrder();

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function addNewTicket(newTicket) {
  let ticketDetails = await ticket.create(newTicket);


  return(ticketDetails)

}
app.post('/tickets/new', async (req, res) => {
  try {
    let newTicket = req.body;
    let response = await addNewTicket(newTicket);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


async function updateTicketById(id, updatedTicket) {
  let ticketDetails = await ticket.findOne({ where: { id } });
  if (!ticketDetails) return null; // Return null if no ticket found

  ticketDetails.set(updatedTicket); // Update ticket fields
  let ticketData = await ticketDetails.save(); // Save changes

  return {
    message: "The ticket has been successfully updated",
    ticketData
  };
}

app.post('/tickets/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let updatedTicket = req.body;
    if (!updatedTicket) res.json({ message: "Invalid  ticket Data"})
    // Validate ID and updatedTicket fields
    

    // Update the ticket
    let response = await updateTicketById(id, updatedTicket);

    // Check if ticket was found and updated
    if (!response) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
