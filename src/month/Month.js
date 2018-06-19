import React, {Component} from 'react';
import {DayPilot, DayPilotMonth} from "daypilot-pro-react";
import "./MonthStyles.css";
import "./icons/style.css";

class Month extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventHeight: 30,
      headerHeight: 30,
      cellMarginBottom: 10,
      cellHeaderHeight: 20,
      eventMarginBottom: 5,
      eventEndSpec: "Date",
      onBeforeEventRender: args => {
        args.data.areas = [
          { top: 6, right: 10, width: 12, height: 14}
        ];
      },
    };
  }

  UserList() {
    fetch('http://54.156.251.97:44302/api/v1/getSchedule')
    .then(response => response.json())
    .then((jsonResult) => {
      
      let eventsLst = [];
      let first = DayPilot.Date.today().firstDayOfMonth();
      var d = new Date(), month = d.getMonth(), mondays = [];
      var i = 0;

      d.setDate(1);
      
      
      while (d.getDay() !== 1) {
          d.setDate(d.getDate() + 1);
      }
      let monthdate = d.getDate()

      jsonResult.forEach(function(element) {
        
        let engineerName =this.getShiftEngineersNameForShift(element) + " are working"
       
        ///Calender Entry
        let elem = this.getCalenderEntry(first,element,engineerName,i,monthdate);
        if (i == 4){
          i = i+3;
        }
        else {
          i++;
        }
        ///Calender Entry
        eventsLst.push(elem);
      }, this);

      this.setState({
        startDate: DayPilot.Date.today(),
        events: eventsLst
      });
      console.log(jsonResult);
    })
  }

  getShiftEngineersNameForShift(element){
    let engineerName = "";
    element.shifts.forEach(function(ee){
        engineerName = engineerName + ", " +  ee.engineer.name
      });
      if(engineerName != null && engineerName.length > 1)
      {
        engineerName = engineerName.substring(2, engineerName.length);
      }
      return engineerName;
  }

  getCalenderEntry(first, element, engineerName,i,monthdate){
    let ddd = first.addDays( ( monthdate + i-1))
    let colorCode = this.getRandomColor();
    let elem = {
      id : element.id,
      text : engineerName,
      start : ddd,
      end: first.addDays(monthdate + i-1),
      backColor: colorCode
    }
    
    return elem;
  }


  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  componentDidMount() {
    this.UserList();
  }

  updateColor(e, color) {
    e.data.backColor = color;
    this.calendar.events.update(e);
  }

  render() {
    var {...config} = this.state;
    return (
      <div>
        <DayPilotMonth
          {...config}
          ref={component => {
            this.calendar = component && component.control;
          }}
        />
      </div>
    );
  }
}

export default Month;
