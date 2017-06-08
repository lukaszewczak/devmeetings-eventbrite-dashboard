'use strict';

const router = require('express').Router();
const moment = require('moment');
const util = require('util');
const config = require('../../../config');

const request = util.promisify(require('request'));

router.get('/', (req, res) => {

    const options = {
        url: 'https://www.eventbriteapi.com/v3/users/me/owned_events/?status=live,started',
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

                res.status(200).json(parsedEvents);
            } else {
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }

    }

    getEventsData(options);
});

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
    options_tickets_classes.url =
        `https://www.eventbriteapi.com/v3/events/${event.id}/attendees?status=attending`;

    try {
        let response = await request(options_tickets_classes);
        event.attendees = JSON.parse(response.body).attendees;
    }
    catch (err) {
        console.error(err);
    }

    return event;
}

function prepareResponse (response) {
    const result = {
        name: response.name.text,
        id: response.id,
        url: response.url,
        start: response.start.local,
        end: response.end.local,
        daysLeft: moment(response.start.local).diff(moment(), 'days'),
        daysFromSalesStart: moment(response.start.local)
            .diff(moment(response.ticket_classes[0].sales_start), 'days'),
        quantity_total: response.ticket_classes[0].quantity_total,
        quantity_sold: response.ticket_classes[0].quantity_sold,
        sales_start: response.ticket_classes[0].sales_start,
        sales_end: response.ticket_classes[0].sales_end,
        salesDays: moment(response.ticket_classes[0].sales_end)
            .diff(moment(response.ticket_classes[0].sales_start), 'days'),
        salesDaysLeft: moment(response.ticket_classes[0].sales_end)
            .diff(moment(), 'days'),
        salesHistory: generateSalesHistory(response.ticket_classes[0].sales_start,
            response.ticket_classes[0].sales_end, response.attendees)
    };

    result.salesDays = result.salesDays < 0 ? 0 : result.salesDays;
    result.salesDaysLeft = result.salesDaysLeft < 0 ? 0 : result.salesDaysLeft;
    result.daysFromSalesStart = result.daysFromSalesStart < 0 ? 0 : result.daysFromSalesStart;
    result.daysLeft = result.daysLeft < 0 ? 0 : result.daysLeft;

    return result;
}

function generateSalesHistory (start, end, attendees) {
    const salesHistory = generateRangeDates(start, end);
    for (let sales of salesHistory) {
        let attendeesFromDay = attendees.filter(attendee => {
            if (moment(sales.date).isSame(moment(attendee.created), 'day')) {
                return attendee;
            }
        });
        sales.attendees = attendeesFromDay.length;
        sales.attendeesList = attendeesFromDay.map(attendee => {
            return {
                resource_uri: attendee.resource_uri,
                id: attendee.id,
                changed: attendee.changed,
                created: attendee.created,
                quantity: attendee.quantity,
                status: attendee.status,
                checked_in: attendee.checked_in,
                cancelled: attendee.cancelled,
                guestlist_id: attendee.guestlist_id,
                invited_by: attendee.invited_by,
                order_id : attendee.order_id
            };
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

module.exports = router;
