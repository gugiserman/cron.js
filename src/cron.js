class Cron {

  static get DEFAULT_DATA() {
    return {
      days: [],
      startTime: '00:00:00'
    };
  }

  static get DAYS_MAP() {
    return {
      0: 'SUN',
      1: 'MON',
      2: 'TUE',
      3: 'WED',
      4: 'THU',
      5: 'FRI',
      6: 'SAT'
    };
  }

  static get REVERSE_DAYS_MAP() {
    let originalMap = Cron.DAYS_MAP
      , reverseMap = {};

    for (let key in Object.keys(originalMap)) {
      reverseMap[ originalMap[key] ] = key;
    }

    return reverseMap;
  }

  static get DEFAULT_OPTIONS() {
    return {
      optimize: false
    };
  }

  /*
  data <Object>
    days: <Array>
      0-6 <Number> or 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' <string>
    startTime: 'HH:mm:ss' <string>
  */

  constructor(data, options) {
    return {
      data: data,
      expression: Cron.make(data, options)
    }
  }

  static make(data = { days: [], startTime: null }, options = {}) {
    options = {
      ...Cron.DEFAULT_OPTIONS,
      ...options
    };

    data = {
      ...Cron.DEFAULT_DATA,
      ...data
    };

    let defaultExp = '* * * * * * *'
      , expression = defaultExp.split(' ')
      , startTime = data.startTime ? data.startTime.split(':').slice(0, 3) : []
      , days = data.days.map( day => {
        if ( !isNaN(parseInt(day)) && typeof parseInt(day) === 'number' ) {
            return day;
        }
        else {
          return Cron.REVERSE_DAYS_MAP[day.substr(0, 3)].toUpperCase();
        }
      }).sort( (a, b) => a - b );

    // Sets hours, minutes and seconds
    if (startTime.length) {
      if (startTime.length === 2) {
        startTime.push('00');
      }

      startTime.forEach((value, index) => {
        if (value) {
          if (value === '00') {
            return '*';
          }
          return expression[index] = value;
        }
      });
    }

    // Sets day of the month
    // expression[3] = ...

    // Sets month
    // expression[4] = ...

    // Sets days of the week
    if (days.length) {
      expression[5] = days.join(',');
      if (options.optimize) {
        expression = Cron.optimize(expression);
      }
    }

    // Sets year
    // expression[6] = ...

    if ( !Cron.isExpressionValid(expression) ) {
      let message = new Error('Failed to make Cron expression...', expression);
      throw new Error(message);
      return message;
    }

    return typeof expression === 'string' ? expression : expression.join(' ');
  }

  static parse(expression) {
    // TODO: Handle string days of week along with integers (e.g.: 'MON', 'TUE')
    let [sec, min, hour, dm, m, dw, year] = expression.match(/\S/gi);

    for (let timeUnit in [sec, min, hour]) {
      if (timeUnit === '*') {
        timeUnit = '00'
      }
    }

    if (dw !== '*') {
      if (dw.indexOf(',') >= 0) {
        dw = dw.split(',');
      }

      for (let i = 0; i < dw.length; i++) {
        if (dw[i].indexOf('-') >= 0) {
          let range = dw[i].split('-').map( d => parseInt(d) )
            , diff = range[range.length - 1] - range[0]
            , days = [range[0]];

          for (let i = 1; i <= diff; i++) {
            days.push(range[0] + i);
          }

          dw = days;
        }
      }
    }

    return {
      days: dw,
      startTime: `${hour}:${min}:${sec}`
    };

  }

  static optimize(expression) {
    let exp = Array.isArray(expression) ? expression : expression.split(' ')
      , canBeShorten = null
      , isNumeric = true

    if ( exp[5] !== '*' && exp[5].indexOf(',') > 0 ) {
        let i = 0
          , days = exp[5].split(',').map( day => {
              if ( !isNaN(parseInt(day)) ) {
                return parseInt(day);
              }
              else {
                isNumeric = false;
                return Cron.REVERSE_DAYS_MAP[day];
              }
            });

      while ( i < (days.length - 1) ) {
        let next = days[i + 1]
          , current = days[i];

        if ( (current > 0 && (next - current === 1)) || (current === 0 && (current + next) === 1) ) {
          canBeShorten = true;
        }
        else {
          canBeShorten = false;
          break;
        }
        i++;
      }

      if ( !isNumeric ) {
        for (let i = 0; i < days.length; i++) {
          days[i] = Cron.DAYS_MAP[ days[i] ];
        }
      }

      if (canBeShorten) {
        exp[5] = ( days[0] + '-' + days[days.length - 1] );
        return exp.join(' ');
      }
    }

    return expression;
  }

  static isExpressionValid(expression) {
    // TODO: validate Cron expression
    return true;
  }

}

window.Cron = Cron;
export default Cron
