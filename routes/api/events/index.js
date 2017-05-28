'use strict';

const router = require('express').Router();
const request = require('request');
const moment = require('moment');
const config = require('../../../config');

router.get('/', (req, res) => {

    const options = {
        url: 'https://www.eventbriteapi.com/v3/users/me/owned_events/?status=live,started',
        headers: {
            'Authorization': `Bearer  ${config.eventbrite.token}`
        }
    };

    request(options, (err, response) => {
        if (!err && response.statusCode === 200) {
            const events = JSON.parse(response.body).events;

            const clearRes = events.map(event => {
                return {
                    name: event.name.text,
                    id: event.id,
                    url: event.url,
                    start: event.start.local,
                    end: event.end.local,
                    daysLeft: moment(event.start.local).diff(moment(), 'days')
                };
            });

            res.status(200).json(clearRes);
        }
        else {
            res.sendStatus(500)
        }
    });

});

module.exports = router;
