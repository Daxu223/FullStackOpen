```mermaid
sequenceDiagram
  participant browser
  participant server

  browser-->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
  activate server
  server-->>browser: 201, Content-type: application/json, {"message":"note created"}
  deactivate server
```
