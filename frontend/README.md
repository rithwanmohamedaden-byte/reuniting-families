# Reuniting Families

A web app that helps families separated after a hurricane find each other, with privacy controls for people who don't want to be found.

 Live app:  PASTE-FRONTEND-LINK
 Backend API:  https://reuniting-families.onrender.com

> Note: the app runs on free hosting, so the first load can take 30 to 60 seconds while the server wakes up.

## Screenshots

<img width="574" height="600" alt="Screenshot 2026-10-17 at 17 07 45" src="https://github.com/user-attachments/assets/bb88e6f3-a3a5-4543-8a54-8e35ae69d117" />

<img width="646" height="781" alt="Screenshot 2026-10-17 at 17 08 10" src="https://github.com/user-attachments/assets/871b49a1-8371-49e2-935b-2210843c3948" />

## The full picture

After a large evacuation, the most important thing is a shared record of who is safe and where. I built  shelter check-in and privacy-aware search , because every other part of the system depends on having records that people can search safely.

How the parts I didn't build would work:

-  Paper records:  Shelters that keep paper lists would have volunteers type them in later, or bulk-import them from a spreadsheet, so they end up in the same searchable database.
-  "Ask me first" follow-up (not built):  When a search matches someone who chose "Ask me first," the searcher would leave a contact request. A shelter volunteer would see the pending request, privately ask the person whether they want to be found, and only share their location if they agree.
-  Children and elderly:  Staff would verify the relationship, for example with a detail only family would know, before releasing any information.
-  Boats, hotels, and other agencies:  These would check people in through the same form, or send records to be imported.

My piece sits at the center: it is the place where records are created and searched, and where privacy choices are enforced.

## Design

 Who uses it 

-  Shelter volunteers:  tired, stretched thin, and not technical. Check-in has to be fast and simple.
-  Searchers:  worried family members, often with no phone or ID, who may only know a name or nickname.
-  People who don't want to be found:  someone who fled an abusive partner, or someone afraid to give their real name.

 Key decisions 

-  Every check-in field is optional.  Nobody needs an ID, a phone number, or even a real name. A nickname works.
-  Check-in codes instead of IDs.  Each person gets a short code that a volunteer can write on a slip of paper.
-  Three privacy levels,  chosen at check-in:
  - *Findable:* searchers see the name, shelter, and code.
  - *Ask me first:* searchers only see "Someone may match. A volunteer will check with them." No name, no location. This is the default.
  - *Only say I am safe:* searchers only see that the person is confirmed safe.
-  Search by name or nickname,  with an optional home neighborhood to narrow results.

 Edge cases I thought about 

- A person with no name, no ID, and no phone can still be checked in and given a code.
- Someone hiding from another person is never exposed. For the two protected levels, search results contain no name and no shelter.
- A searcher who finds nothing is told people are still checking in and to try again later, instead of seeing a dead end.
- Volunteers are not pushed to collect more information than the person wants to share.
- 




## Technical choices

-  Frontend:  React (Vite)
-  Backend:  Node.js and Express
-  Database:  SQLite
-  Hosting:  Render (frontend and backend)

I chose this stack because it is simple, it runs fully on free hosting, and it let me spend my time on the privacy logic instead of setup. The privacy rules are enforced on the backend, so the server decides what each search is allowed to reveal and the frontend never receives hidden details.

 Biggest tradeoff:  privacy versus findability. I made "Ask me first" the default because exposing someone who is hiding from an abuser is worse than slowing down a reunion. The cost is that families searching for someone who chose a protected level get less information up front, and reunions that depend on a volunteer follow-up will take longer.

## Limitations and what I'd do next

 Data can be wiped (SQLite on free hosting).  The database is a single SQLite file. On free hosting, that file can be erased when the server restarts or redeploys, so check-ins could be lost. For a real disaster this would be unacceptable. In production I would use a hosted database like PostgreSQL that keeps data permanently. I chose SQLite because it needs no setup and let me focus on the privacy logic.

 The check-in page is open to anyone.  Right now anyone with the link can add people. In a real deployment, only shelter staff should be able to check people in, for example with a shelter PIN. Otherwise someone could add fake records or probe the system. I left it open to keep the demo simple to test.

## How I used AI

I used Claude to help me debug my code.
