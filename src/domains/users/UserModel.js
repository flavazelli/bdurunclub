// src/domains/events/EventModel.js
export class User {
  constructor({ id, firstName, lastName, email, pace, bduResident, roles, level }) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.pace = pace
    this.bduResident = bduResident
    this.roles = roles
    this.level = level
  }
  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
