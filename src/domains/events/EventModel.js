// src/domains/events/EventModel.js
export class Event {
    constructor({ id, title, date, startingLocation, gpxFiles, description }) {
      this.id = id;
      this.title = title;
      this.eventTime = new Date(date);
      this.gpxFiles = gpxFiles;
      this.description = description;
      this.startingLocation = startingLocation;
    }
  
    getFormattedDate() {
      return this.date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
  }