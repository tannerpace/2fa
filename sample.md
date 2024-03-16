## Plaform Capabilities

- Receive incoming text messages
- Lookup where to forward the messages (as email)
- Forward the message to the appropriate email addresses

## Data Structure

- `Users` own the `phone numbers`
- `Phone numbers` own the `forwards`
- `Forwards` are an email address
- There can be multiple `forwards` for a `phone number`
- Payment is handled at the user level (cab be built later)
