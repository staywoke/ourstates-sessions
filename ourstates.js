/**
 * OurStates Session Check
 * Created by: Peter Schmalfeldt
 * Licensed under the terms of the MIT license.
 */
(function () {

  /**
   * Session End Dates by State
   * @type {object}
   */
  var end_dates = { AL: '5/31/2017', AK: '4/16/2017', AZ: '4/22/2017', AR: '5/5/2017', CA: '9/15/2017', CO: '5/10/2017', CT: '6/7/2017', DE: '6/30/2017', FL: '5/5/2017', GA: '3/24/2017', HI: '5/4/2017', ID: '3/31/2017', IL: '5/31/2017', IN: '4/29/2017', IA: '4/18/2017', KS: '5/15/2017', KY: '3/30/2017', LA: '6/8/2017', ME: '6/14/2017', MD: '4/10/2017', MA: '11/15/2017', MI: '12/31/2017', MN: '5/22/2017', MS: '4/2/2017', MO: '5/12/2017', MT: '4/25/2017', NE: '6/2/2017', NV: '6/5/2017', NH: '6/30/2017', NJ: '1/9/2018', NM: '3/18/2017', NY: '12/31/2017', NC: '8/1/2017', ND: '4/26/2017', OH: '12/31/2017', OK: '5/26/2017', OR: '7/10/2017', PA: '12/31/2017', RI: '6/30/2017', SC: '6/1/2017', SD: '3/27/2017', TN: '4/14/2017', TX: '5/29/2017', UT: '3/9/2017', VT: '5/8/2017', VA: '2/25/2017', WA: '4/23/2017', MV: '4/8/2017', WI: '12/31/2017', WY: '3/3/2017' };

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

    var legislative_session = '<a class="other-states" href="https://ballotpedia.org/Dates_of_2017_state_legislative_sessions" target="_blank">legislative session</a>.';

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
