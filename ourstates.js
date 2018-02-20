/**
 * OurStates Session Check
 * Created by: Peter Schmalfeldt
 * Licensed under the terms of the MIT license.
 */
(function () {
  /**
   * Get Current Year
   * @type {Date}
   */
  var date = new Date();
  var current_year = date.getFullYear();

  /**
   * Session End Dates by State
   * @type {object}
   */
  var end_dates = {
    AL: '5/31/' + current_year,
    AK: '4/16/' + current_year,
    AZ: '4/22/' + current_year,
    AR: '5/5/' + current_year,
    CA: '9/15/' + current_year,
    CO: '5/10/' + current_year,
    CT: '6/7/' + current_year,
    DE: '6/30/' + current_year,
    FL: '5/5/' + current_year,
    GA: '3/24/' + current_year,
    HI: '5/4/' + current_year,
    ID: '3/31/' + current_year,
    IL: '5/31/' + current_year,
    IN: '4/29/' + current_year,
    IA: '4/18/' + current_year,
    KS: '5/15/' + current_year,
    KY: '3/30/' + current_year,
    LA: '6/8/' + current_year,
    ME: '6/14/' + current_year,
    MD: '4/10/' + current_year,
    MA: '11/15/' + current_year,
    MI: '12/31/' + current_year,
    MN: '5/22/' + current_year,
    MS: '4/2/' + current_year,
    MO: '5/12/' + current_year,
    MT: '4/25/' + current_year,
    NE: '6/2/' + current_year,
    NV: '6/5/' + current_year,
    NH: '6/30/' + current_year,
    NJ: '1/9/' + (current_year + 1),
    NM: '3/18/' + current_year,
    NY: '12/31/' + current_year,
    NC: '8/1/' + current_year,
    ND: '4/26/' + current_year,
    OH: '12/31/' + current_year,
    OK: '5/26/' + current_year,
    OR: '7/10/' + current_year,
    PA: '12/31/' + current_year,
    RI: '6/30/' + current_year,
    SC: '6/1/' + current_year,
    SD: '3/27/' + current_year,
    TN: '4/14/' + current_year,
    TX: '5/29/' + current_year,
    UT: '3/9/' + current_year,
    VT: '5/8/' + current_year,
    VA: '2/25/' + current_year,
    WA: '4/23/' + current_year,
    MV: '4/8/' + current_year,
    WI: '12/31/' + current_year,
    WY: '3/3/' + current_year
  };


  /**
   * Get Current Location if Browser Supports it
   */
  var getLocation = function() {
    if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(getStateFromLocation, geoError, options);
    }
  };

  /**
   * Handle Location Data
   * @param position
   */
  var getStateFromLocation = function (position) {
    if (position && typeof position.coords === 'object' && typeof position.coords.latitude !== 'undefined' && typeof position.coords.latitude !== 'undefined') {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
         var response = JSON.parse(this.responseText);

         if (response && response.errors.length === 0) {
           var end_date = end_dates[response.data[0].state_code];
           showEndDate(response.data[0].state_name, end_date);
         }
        }
      };
      xhttp.open('GET', 'https://api.civil.services/v1/state?latitude=' + position.coords.latitude + '&longitude=' + position.coords.longitude + '&fields=state_name,state_code&apikey=FFE7F65D-4123-A4A4-411A-C7432322F552', true);
      xhttp.send();
    }
  };

  /**
   * Failed to Fetch Location Data
   * @param err
   */
  var geoError = function (err) {
    var data_string = '<span class="days-left">27</span> states finish legislating in the next <a class="other-states" href="https://ballotpedia.org/Dates_of_2017_state_legislative_sessions" target="_blank">2 months</a>.';
    var elm = document.getElementById('our-states-days-left');

    if (elm) {
      elm.innerHTML = data_string;
    }

    console.error(err);
  };

  /**
   * Show End Date for Selected State
   * @param state
   * @param end_date
   */
  var showEndDate = function (state, end_date) {
    var today = new Date();
    var date_to_end = new Date(end_date);
    var days = Math.floor((date_to_end.getTime() - today.getTime()) / ( 1000 * 60 * 60 * 24 ));
    var data_string = '';

    var legislative_session = '<a class="other-states" href="https://ballotpedia.org/Dates_of_' + current_year + '_state_legislative_sessions" target="_blank">legislative session</a>.';

    if (days === 0) {
      data_string = 'Today is the last day in <span class="state-name">' + state + '\'s</span> ' + legislative_session;
    } else if (days === 1) {
      data_string = '<span class="days-left">' + days + '</span> day left in <span class="state-name">' + state + '\'s</span> ' + legislative_session;
    } else if (days > 1) {
      data_string = '<span class="days-left">' + days + '</span> days left in <span class="state-name">' + state + '\'s</span> ' + legislative_session;
    } else {
      data_string = state + '\'s ' + legislative_session + ' has ended.';
    }

    var elm = document.getElementById('our-states-days-left');

    if (elm) {
      elm.innerHTML = data_string;
    }
  };

  /**
   * Listen for Window Load Event
   */
  window.onload = getLocation();
})();
