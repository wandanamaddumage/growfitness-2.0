# Grow Fitness 2.0 - Notification Roles & Portals Summary

This document summarizes the notifications processed by the Grow Fitness 2.0 system, categorized by their recipient role (Admin, Coach, and Parent Portal). It includes both the **Currently Implemented** notifications and the **Proposed / Roadmap** notifications to achieve a perfect user experience.

---

## 1. Admin Portal Notifications (Recipient: Administrators)

Administrators primarily receive alerts regarding user registrations, booking requests, payment completions, and administrative cron tasks.

| Status | Scenario | Trigger / Source File | Channel | Notification Title & Key Message |
| :--- | :--- | :--- | :--- | :--- |
| **Implemented** | **New User Registration Request** | [users.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/users/users.service.ts) | In-App | **New user registration request**:<br>`"{{parentName}} has requested to join."` |
| **Implemented** | **Free Session Request Submitted** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **New free session request**:<br>`"{{parentName}} requested a free session for {{kidName}}."` |
| **Implemented** | **Session Reschedule Requested** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **New reschedule request**:<br>`"A session reschedule has been requested."` |
| **Implemented** | **Extra Session Requested** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **New extra session request**:<br>`"An extra session has been requested."` |
| **Implemented** | **Invoice Creation Reminder** | [reminders.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/reminders/reminders.service.ts) *(Daily Cron)* | In-App | **Reminder: Create and send invoices**:<br>`"You have {{completedCount}} completed session(s) in the past 7 days. Remember to create and send invoices."` |
| **PROPOSED** | **Payment Received Alert** | [invoices.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/invoices/invoices.service.ts) | In-App / Email | **Payment Received**: <br>`"Parent {{parentName}} has successfully paid Invoice #{{id}}."` |

---

## 2. Coach Portal Notifications (Recipient: Coaches)

Coaches receive scheduling updates, account generation details, urgent cancellations, and payout information.

| Status | Scenario | Trigger / Source File | Channel | Notification Title & Key Message |
| :--- | :--- | :--- | :--- | :--- |
| **Implemented** | **Password Reset Request** | [auth.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/auth/auth.service.ts) | Email | **Reset Your Password**:<br>Instructions and a password reset link. |
| **Implemented** | **Coach Account Created** | [users.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/users/users.service.ts) | Email, SMS | **Your Grow Fitness coach account**:<br>`"Hi {{coachName}}, your Grow Fitness coach account is ready. Sign in: {{loginUrl}}..."` |
| **Implemented** | **Reschedule Request Status** *(if initiated by Coach)* | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **Reschedule approved** / **Reschedule denied** |
| **Implemented** | **Session Scheduled (Single/Recurring)** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App | **New session scheduled** / **Recurring sessions scheduled** |
| **Implemented** | **Session Updated** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App, Email, SMS | **Session updated**:<br>`"Session '{{title}}': {{changes}}"` (e.g. status or datetime changes). |
| **Implemented** | **Session Deleted** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App | **Session deleted**:<br>`"Session '{{session.title}}' has been deleted."` |
| **Implemented** | **Payout Invoice Delivered** | [invoice-pdf.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/invoices/invoice-pdf.service.ts) | In-App, Email (PDF) | **New payout invoice**:<br>Payout invoice attached as a PDF buffer. |
| **Implemented** | **Payout Processed** | [invoices.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/invoices/invoices.service.ts) | In-App, Email, SMS | **Payment Processed**:<br>`"Hello {{coachName}}, your monthly payment has been processed."` |
| **Implemented** | **Upcoming Session Reminder** | [reminders.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/reminders/reminders.service.ts) *(Daily Cron)* | In-App | **Upcoming session**:<br>`"Reminder: '{{sessionTitle}}' is scheduled within the next 24 hours ({{dateStr}})."` |
| **PROPOSED** | **Urgent Session Cancellation** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | Email, SMS | **URGENT: Session Cancelled**: <br>`"URGENT: Session '{{title}}' scheduled on {{date}} has been cancelled."` |

---

## 3. Parent Portal Notifications (Recipient: Parents)

Parents receive alerts relating to their enrollment lifecycle, student activities, scheduling changes, and bills/receipts.

| Status | Scenario | Trigger / Source File | Channel | Notification Title & Key Message |
| :--- | :--- | :--- | :--- | :--- |
| **Implemented** | **User Registration Status (Approved)** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App, Email, SMS | **Registration approved**:<br>`"Hello {{parentName}}, your Grow Fitness account has been approved."` |
| **Implemented** | **User Registration Status (Rejected)** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **Registration not approved**:<br>`"Your account registration was not approved. Please contact support..."` |
| **Implemented** | **Password Reset Request** | [auth.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/auth/auth.service.ts) | Email | **Reset Your Password**:<br>Instructions and a password reset link. |
| **Implemented** | **Profile Updated (Self-Service)** | [users.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/users/users.service.ts) | In-App | **Profile updated**:<br>`"Your profile information was saved."` |
| **Implemented** | **Profile Updated (By Admin)** | [users.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/users/users.service.ts) | In-App | **Profile updated**:<br>`"An administrator updated your profile information."` |
| **Implemented** | **Free Session Request Confirmed** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App, Email, SMS | **Free session confirmed**:<br>`"Hello {{parentName}}, your free session request for {{kidName}} has been confirmed!"` |
| **Implemented** | **Reschedule Request Status** *(if initiated by Parent)* | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **Reschedule approved** / **Reschedule denied** |
| **Implemented** | **Extra Session Request Status** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | In-App | **Extra session approved** / **Extra session denied** |
| **Implemented** | **Session Scheduled (Single/Recurring)** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App | **New session scheduled** / **Recurring sessions scheduled** |
| **Implemented** | **Session Updated** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App, Email, SMS | **Session updated**:<br>`"Session '{{title}}': {{changes}}"` (e.g. status or datetime changes). |
| **Implemented** | **Session Deleted** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | In-App | **Session deleted**:<br>`"Session '{{session.title}}' has been deleted."` |
| **Implemented** | **New Invoice Issued** | [invoice-pdf.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/invoices/invoice-pdf.service.ts) | In-App, Email (PDF), SMS Alert | **New invoice**:<br>`"A new invoice has been issued for you. Please log in to view and pay."` |
| **Implemented** | **Invoice Payment Status Updated** | [invoices.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/invoices/invoices.service.ts) | In-App, Email, SMS | **Invoice updated**:<br>`"Your invoice status has been updated to: {{status}}."` |
| **Implemented** | **Invoice Payment Reminder** | [reminders.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/reminders/reminders.service.ts) *(Daily Cron)* | In-App | **Reminder: Pay your invoice**:<br>`"You have an outstanding or soon-due invoice. Please log in to view and pay."` |
| **Implemented** | **Month-End Payment Reminder** | [reminders.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/reminders/reminders.service.ts) *(Monthly Cron)* | In-App, Email, SMS | **Month-end reminder: Outstanding invoice**:<br>`"Friendly reminder: you have an outstanding invoice from Grow Fitness. Please log in before month end."` |
| **Implemented** | **Upcoming Session Reminder** | [reminders.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/reminders/reminders.service.ts) *(Daily Cron)* | In-App | **Upcoming session**:<br>`"Reminder: '{{sessionTitle}}' is scheduled within the next 24 hours."` |
| **PROPOSED** | **Registration Received Confirmation** | [users.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/users/users.service.ts) | Email | **Registration Request Received**: <br>`"Hello {{parentName}}, we have received your request to join. Our team will review it shortly."` |
| **PROPOSED** | **Registration Rejected (Outbound)** | [requests.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/requests/requests.service.ts) | Email | **Registration Request Not Approved**: <br>`"Hello {{parentName}}, your account registration request could not be approved at this time. Please contact support."` |
| **PROPOSED** | **Payment Receipt Confirmation** | [invoices.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/invoices/invoices.service.ts) | Email | **Payment Receipt for Invoice #{{id}}**: <br>`"Thank you! We have received your payment. Your receipt details are enclosed."` |
| **PROPOSED** | **Urgent Session Cancellation** | [sessions.service.ts](file:///Users/wandanamaddumage/Developer/growfitness-2.0/apps/api/src/modules/sessions/sessions.service.ts) | Email, SMS | **URGENT: Session Cancelled**: <br>`"URGENT: Session '{{title}}' scheduled on {{date}} has been cancelled."` |
