#!/usr/bin/env osascript -l JavaScript
/* globals Application -- applescript */
/* eslint-disable new-cap -- API */

// Inspired by https://apple.stackexchange.com/a/311153/206073
// e.g., ./atyourcommand-reminders-demo.js "must do xyz" 2020/01/01 01:00:00PM
const RemindersApp = Application('Reminders');

/* eslint-disable no-unused-vars -- AppleScript needs the non-exported function */
/**
 *
 * @param {string[]} argv
 * @returns {void}
 */
function run (argv) {
  /* eslint-enable no-unused-vars -- AppleScript needs the non-exported function */
  const [name, date, time] = argv;

  // Dates need slashes instead of hyphens for Safari
  const dueDate = new Date(date + ' ' + time);

  const reminder = (Number.isNaN(dueDate.getTime()))
    // @ts-expect-error -- How to get?
    ? RemindersApp.Reminder({name}) // Invalid date
    // @ts-expect-error -- How to get?
    : RemindersApp.Reminder({name, dueDate});

  // @ts-expect-error -- How to get?
  RemindersApp.defaultList.reminders.push(reminder);
}
