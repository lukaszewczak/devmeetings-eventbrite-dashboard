'use strict';

const moment = require('moment');
const util = require('util');
const config = require('../../../config/index');
const {cache} = require('../../../lib');

const request = util.promisify(require('request'));

function getEvents (req, res, next) {
  if (cache.isValid(req.params.status)) {
    const cachedResponse = cache.get(req.params.status);
    return res.status(200).json(cachedResponse.data);
  }

  const options = {
    url: `https://www.eventbriteapi.com/v3/users/me/owned_events?order_by=created_desc&status=${req.params.status}`,
    headers: {
      'Authorization': `Bearer  ${config.eventbrite.token}`
    }
  };

  async function getEventsData (options) {
    try {
      const response = await request(options);
      if (response && response.statusCode === 200) {
        const events = JSON.parse(response.body).events;
        const promises = events.map(getEventTicketClassAndAttendess);
        const eventsWithTicketClassesAndAttendess = await Promise.all(promises);
        const parsedEvents = eventsWithTicketClassesAndAttendess.map(prepareResponse);

        cache.set(req.params.status, parsedEvents);
        res.status(200).json(parsedEvents);

      } else {
        next(`ERROR::getEventsData:statusCode: ${response.statusCode}`);
      }
    } catch (err) {
      next(`ERROR::getEventsData: ${err}`);
    }

  }

  getEventsData(options);
}

async function getEventTicketClassAndAttendess (event) {
  const options_tickets_classes = {
    url: `https://www.eventbriteapi.com/v3/events/${event.id}/ticket_classes`,
    headers: {
      'Authorization': `Bearer  ${config.eventbrite.token}`
    }
  };

  try {
    let response = await request(options_tickets_classes);
    event.ticket_classes = JSON.parse(response.body).ticket_classes;
  } catch (err) {
    console.error(err);
  }

  try {
    let page = 1;
    let allData = false;
    event.attendees = [];

    while (!allData) {
      options_tickets_classes.url =
        `https://www.eventbriteapi.com/v3/events/${event.id}/attendees?status=attending&page=${page}`;
      let response = await request(options_tickets_classes);
      let body = JSON.parse(response.body);
      event.attendees = event.attendees.concat(body.attendees);
      allData = !body.pagination.has_more_items;
      page += 1;
    }

  }
  catch (err) {
    console.error(err);
  }

  return event;
}

function prepareResponse (response) {
  let sales_start, sales_end, quantity_total = 0, quantity_sold = 0, ticket_classes = [];

  for (let ticket_class of response.ticket_classes) {
    ticket_classes.push({
      name: ticket_class.name,
      quantity_total: ticket_class.quantity_total,
      quantity_sold: ticket_class.quantity_sold
    });

    quantity_total = quantity_total + ticket_class.quantity_total;
    quantity_sold = quantity_sold + ticket_class.quantity_sold;

    if (!sales_start || sales_start.isAfter(moment(ticket_class.sales_start))) {
      if (moment(response.created).isBefore(ticket_class.sales_start)) {
        sales_start = moment(ticket_class.sales_start);
      }
    }
    if (!sales_end ||
      (sales_end.isAfter(moment(ticket_class.sales_end)) &&
        moment(ticket_class.sales_end).isBefore(moment(response.start.local)))) {
      sales_end = moment(ticket_class.sales_end);
    }
  }

  if (!sales_start) {
    sales_start = moment(response.created);
  }

  const result = {
    name: response.name.text,
    id: response.id,
    url: response.url,
    status: response.status,
    start: moment(response.start.local).format('LLL'),
    end: moment(response.end.local).format('YYYY-MM-DD HH:mm'),
    daysLeft: moment(response.start.local).diff(moment(), 'days'),
    daysFromSalesStart: moment(response.start.local)
      .diff(sales_start, 'days'),
    quantity_total: quantity_total,
    quantity_sold: quantity_sold,
    tickets: ticket_classes,
    sales_start: sales_start.format('YYYY-MM-DD HH:mm'),
    sales_end: sales_end.format('YYYY-MM-DD HH:mm'),
    salesDays: sales_end.diff(sales_start, 'days'),
    salesDaysLeft: sales_end.diff(moment(), 'days'),
    salesHistory: generateSalesHistory(sales_start, sales_end, response.attendees)
  };

  result.salesDays = result.salesDays < 0 ? 0 : result.salesDays;
  result.salesDaysLeft = result.salesDaysLeft < 0 ? 0 : result.salesDaysLeft;
  result.daysFromSalesStart = result.daysFromSalesStart < 0 ? 0 : result.daysFromSalesStart;
  result.daysLeft = result.daysLeft < 0 ? 0 : result.daysLeft;

  return result;
}

function generateSalesHistory (start, end, attendees) {
  const salesHistory = generateRangeDates(start, end);
  let attendeesAmounts = [];
  for (let sales of salesHistory) {
    let attendeesFromDay = attendees.filter(attendee => {
      if (moment(sales.date).isSame(moment(attendee.created), 'day')) {
        return attendee;
      }
    });
    sales.percentage = 0;
    sales.attendees = attendeesFromDay.length;
    attendeesAmounts.push(sales.attendees)
  }

  attendeesAmounts = attendeesAmounts.sort((a, b) => {
    if (a === b) return 0;
    if (a > b) return -1;
    else return 1;
  });

  const maxValue = attendeesAmounts[0];

  let attendeesAmountsPercentage = attendeesAmounts.map(value => {
    const percentage = maxValue > 0 ? ((value * 100) / maxValue).toFixed(2) : 0;
    return {
      percentage,
      value
    };
  });

  for (let sales of salesHistory) {
    attendeesAmountsPercentage.forEach(data => {
      if (data.value === sales.attendees) {
        sales.percentage = data.percentage;
      }
    });
  }

  return salesHistory;
}

function generateRangeDates (start, end) {
  const result = [];
  while (true) {
    result.push({date: moment(start).format('YYYY-MM-DD')});
    start = moment(start).add(1, 'days');
    if (start.isAfter(end)) {
      break;
    }
  }
  return result;
}

module.exports = getEvents;
