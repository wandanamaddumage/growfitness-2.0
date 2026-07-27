# Grow Fitness 2.0 - Notification Roles & Portals Summary

This document summarizes the notifications processed by the Grow Fitness 2.0 system, categorized by their recipient role (Admin, Coach, and Parent Portal).

---

## 1. Admin Portal Notifications (Recipient: Administrators)

Administrators primarily receive **In-App** alerts regarding user registrations, booking requests, and administrative cron tasks.

| Scenario | Trigger / Source File | Channel | Notification Title & Key Message |
| :--- | :--- | :--- | :--- |
| **New User Registration Request** | [users.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/users/users.service.ts) | In-App | **New user registration request**:<br>`"{{parentName}} has requested to join."` |
| **Free Session Request Submitted** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **New free session request**:<br>`"{{parentName}} requested a free session for {{kidName}}."` |
| **Session Reschedule Requested** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **New reschedule request**:<br>`"A session reschedule has been requested."` |
| **Extra Session Requested** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **New extra session request**:<br>`"An extra session has been requested."` |
| **Invoice Creation Reminder** | [reminders.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/reminders/reminders.service.ts) *(Daily Cron)* | In-App | **Reminder: Create and send invoices**:<br>`"You have {{completedCount}} completed session(s) in the past 7 days. Remember to create and send invoices."` |

---

## 2. Coach Portal Notifications (Recipient: Coaches)

Coaches receive scheduling updates, account generation details, scheduling change reports, and payout information.

| Scenario | Trigger / Source File | Channel | Notification Title & Key Message |
| :--- | :--- | :--- | :--- |
| **Password Reset Request** | [auth.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/auth/auth.service.ts) | Email | **Reset Your Password**:<br>Instructions and a password reset link. |
| **Coach Account Created** | [users.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/users/users.service.ts) | Email, SMS | **Your Grow Fitness coach account**:<br>`"Hi {{coachName}}, your Grow Fitness coach account is ready. Sign in: {{loginUrl}}..."` |
| **Reschedule Request Status** *(if initiated by Coach)* | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **Reschedule approved** / **Reschedule denied** |
| **Session Scheduled (Single/Recurring)** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App | **New session scheduled** / **Recurring sessions scheduled** |
| **Session Updated** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App, Email, SMS | **Session updated**:<br>`"Session '{{title}}': {{changes}}"` (e.g. status or datetime changes). |
| **Session Deleted** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App | **Session deleted**:<br>`"Session '{{session.title}}' has been deleted."` |
| **Payout Invoice Delivered** | [invoice-pdf.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/invoices/invoice-pdf.service.ts) | In-App, Email (PDF) | **New payout invoice**:<br>Payout invoice attached as a PDF buffer. |
| **Payout Processed** | [invoices.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/invoices/invoices.service.ts) | In-App, Email, SMS | **Payment Processed**:<br>`"Hello {{coachName}}, your monthly payment has been processed."` |
| **Upcoming Session Reminder** | [reminders.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/reminders/reminders.service.ts) *(Daily Cron)* | In-App | **Upcoming session**:<br>`"Reminder: '{{sessionTitle}}' is scheduled within the next 24 hours ({{dateStr}})."` |

---

## 3. Parent Portal Notifications (Recipient: Parents)

Parents receive a comprehensive suite of alerts relating to their enrollment lifecycle, student activities, scheduling changes, and bills/receipts.

| Scenario | Trigger / Source File | Channel | Notification Title & Key Message |
| :--- | :--- | :--- | :--- |
| **User Registration Status** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App, Email, SMS | **Registration approved** / **Registration not approved** |
| **Password Reset Request** | [auth.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/auth/auth.service.ts) | Email | **Reset Your Password**:<br>Instructions and a password reset link. |
| **Profile Updated (Self-Service)** | [users.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/users/users.service.ts) | In-App | **Profile updated**:<br>`"Your profile information was saved."` |
| **Profile Updated (By Admin)** | [users.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/users/users.service.ts) | In-App | **Profile updated**:<br>`"An administrator updated your profile information."` |
| **Free Session Request Confirmed** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App, Email, SMS | **Free session confirmed**:<br>`"Hello {{parentName}}, your free session request for {{kidName}} has been confirmed!"` |
| **Reschedule Request Status** *(if initiated by Parent)* | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **Reschedule approved** / **Reschedule denied** |
| **Extra Session Request Status** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **Extra session approved** / **Extra session denied** |
| **Session Scheduled (Single/Recurring)** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App | **New session scheduled** / **Recurring sessions scheduled** |
| **Session Updated** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App, Email, SMS | **Session updated**:<br>`"Session '{{title}}': {{changes}}"` (e.g. status or datetime changes). |
| **Session Deleted** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App | **Session deleted**:<br>`"Session '{{session.title}}' has been deleted."` |
| **New Invoice Issued** | [invoice-pdf.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/invoices/invoice-pdf.service.ts) | In-App, Email (PDF), SMS Alert | **New invoice**:<br>`"A new invoice has been issued for you. Please log in to view and pay."` |
| **Invoice Payment Status Updated** | [invoices.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/invoices/invoices.service.ts) | In-App, Email, SMS | **Invoice updated**:<br>`"Your invoice status has been updated to: {{status}}."` |
| **Invoice Payment Reminder** | [reminders.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/reminders/reminders.service.ts) *(Daily Cron)* | In-App | **Reminder: Pay your invoice**:<br>`"You have an outstanding or soon-due invoice. Please log in to view and pay."` |
| **Month-End Payment Reminder** | [reminders.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/reminders/reminders.service.ts) *(Monthly Cron)* | In-App, Email, SMS | **Month-end reminder: Outstanding invoice**:<br>`"Friendly reminder: you have an outstanding invoice from Grow Fitness. Please log in before month end."` |
| **Upcoming Session Reminder** | [reminders.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/reminders/reminders.service.ts) *(Daily Cron)* | In-App | **Upcoming session**:<br>`"Reminder: '{{sessionTitle}}' is scheduled within the next 24 hours."` |
