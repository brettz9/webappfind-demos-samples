#!/usr/bin/env osascript -l JavaScript
/* eslint-env applescript */

// Inspired by https://apple.stackexchange.com/a/311153/206073
// e.g., ./atyourcommand-reminders-demo.js "must do xyz" 2020/01/01 01:00:00PM
const RemindersApp = Application('Reminders');

// eslint-disable-next-line no-unused-vars
function run (argv) { // lgtm [js/unused-local-variable]
    const [name, date, time] = argv;

    // Dates need slashes instead of hyphens for Safari
    const dueDate = new Date(date + ' ' + time);

    const reminder = (Number.isNaN(dueDate.getTime()))
        ? RemindersApp.Reminder({name}) // Invalid date
        : RemindersApp.Reminder({name, dueDate});

    RemindersApp.defaultList.reminders.push(reminder);
}
