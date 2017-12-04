 $(document).ready(function () {
   userAuth();
   initCandleChart();
   listenForChartUpdate();
 });

 function updateCandleChart() {
   whichExchange = $('#exchange').val();
   whichCurrency = $('#currencypair').val();
   whichPeriod = $('#period').val();
   renderCandleChart(whichExchange, whichCurrency, whichPeriod);
 }

 function listenForChartUpdate() {
   $('#hello select').on("change", function () {
     showLoading();
     updateCandleChart();
   });
 }

 function initCandleChart() {

   whichExchange = $('#exchange').val();
   whichCurrency = $('#currencypair').val();
   whichPeriod = $('#period').val();
   renderCandleChart(whichExchange, whichCurrency, whichPeriod);
 }


 function renderCandleChart(exchange, currencypair, period) {
   $.getJSON('https://stark-island-54204.herokuapp.com/cloud/api/beta/' + exchange + '.php?currencypair=' + currencypair + "&period=" + period, function (data) {
     console.log(data)
     hideLoading();
     if (typeof data.status == "string") {
       alert(data.msg);
       return;
     }
     // split the data set into ohlc and volume
     var ohlc = [],
       volume = [],
       dataLength = data.length,
       // set the allowed units for data grouping
       groupingUnits = [
         [
           'hour', // unit name
           [1, 2, 3, 4, 6, 8, 12] // allowed multiples
         ],
         [
           'month', [1, 2, 3, 4, 6]
         ]
       ],

       i = 0;

     for (i; i < dataLength; i += 1) {
       ohlc.push([
         data[i][0], // the date
         data[i][1], // open
         data[i][2], // high
         data[i][3], // low
         data[i][4] // close
       ]);

       volume.push([
         data[i][0], // the date
         data[i][5] // the volume
       ]);
     }


     // create the chart



     Highcharts.theme = {
       colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
         '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
       ],
       chart: {
         backgroundColor: {
           linearGradient: {
             x1: 0,
             y1: 0,
             x2: 1,
             y2: 1
           },
           stops: [
             [0, '#2a2a2b'],
             [1, '#3e3e40']
           ]
         },
         style: {
           fontFamily: '\'Unica One\', sans-serif'
         },
         plotBorderColor: '#606063'
       },
       title: {
         style: {
           color: '#E0E0E3',
           textTransform: 'uppercase',
           fontSize: '20px'
         }
       },
       subtitle: {
         style: {
           color: '#E0E0E3',
           textTransform: 'uppercase'
         }
       },
       xAxis: {
         gridLineColor: '#707073',
         labels: {
           style: {
             color: '#E0E0E3'
           }
         },
         lineColor: '#707073',
         minorGridLineColor: '#505053',
         tickColor: '#707073',
         title: {
           style: {
             color: '#A0A0A3'

           }
         }
       },
       yAxis: {
         gridLineColor: '#707073',
         labels: {
           style: {
             color: '#E0E0E3'
           }
         },
         lineColor: '#707073',
         minorGridLineColor: '#505053',
         tickColor: '#707073',
         tickWidth: 1,
         title: {
           style: {
             color: '#A0A0A3'
           }
         }
       },
       tooltip: {
         backgroundColor: 'rgba(0, 0, 0, 0.85)',
         style: {
           color: '#F0F0F0'
         }
       },
       plotOptions: {
         series: {
           dataLabels: {
             color: '#B0B0B3'
           },
           marker: {
             lineColor: '#333'
           }
         },
         boxplot: {
           fillColor: '#505053'
         },
         candlestick: {
           lineColor: 'white'
         },
         errorbar: {
           color: 'white'
         }
       },
       legend: {
         itemStyle: {
           color: '#E0E0E3'
         },
         itemHoverStyle: {
           color: '#FFF'
         },
         itemHiddenStyle: {
           color: '#606063'
         }
       },
       credits: {
         style: {
           color: '#666'
         }
       },
       labels: {
         style: {
           color: '#707073'
         }
       },

       drilldown: {
         activeAxisLabelStyle: {
           color: '#F0F0F3'
         },
         activeDataLabelStyle: {
           color: '#F0F0F3'
         }
       },

       navigation: {
         buttonOptions: {
           symbolStroke: '#DDDDDD',
           theme: {
             fill: '#505053'
           }
         }
       },

       // scroll charts
       rangeSelector: {
         buttonTheme: {
           fill: '#505053',
           stroke: '#000000',
           style: {
             color: '#CCC'
           },
           states: {
             hover: {
               fill: '#707073',
               stroke: '#000000',
               style: {
                 color: 'white'
               }
             },
             select: {
               fill: '#000003',
               stroke: '#000000',
               style: {
                 color: 'white'
               }
             }
           }
         },
         inputBoxBorderColor: '#505053',
         inputStyle: {
           backgroundColor: '#333',
           color: 'silver'
         },
         labelStyle: {
           color: 'silver'
         }
       },

       navigator: {
         handles: {
           backgroundColor: '#666',
           borderColor: '#AAA'
         },
         outlineColor: '#CCC',
         maskFill: 'rgba(255,255,255,0.1)',
         series: {
           color: '#7798BF',
           lineColor: '#A6C7ED'
         },
         xAxis: {
           gridLineColor: '#505053'
         }
       },

       scrollbar: {
         barBackgroundColor: '#808083',
         barBorderColor: '#808083',
         buttonArrowColor: '#CCC',
         buttonBackgroundColor: '#606063',
         buttonBorderColor: '#606063',
         rifleColor: '#FFF',
         trackBackgroundColor: '#404043',
         trackBorderColor: '#404043'
       },

       // special colors for some of the
       legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
       background2: '#505053',
       dataLabelsColor: '#B0B0B3',
       textColor: '#C0C0C0',
       contrastTextColor: '#F0F0F3',
       maskColor: 'rgba(255,255,255,0.3)'
     };

     // Apply the theme
     Highcharts.setOptions(Highcharts.theme);


     Highcharts.stockChart('container', {

       rangeSelector: {
         selected: 1
       },

       title: {
         text: currencypair + ' Historical'
       },

       yAxis: [{
         labels: {
           align: 'right',
           x: -3
         },
         title: {
           text: 'OHLC'
         },
         height: '60%',
         lineWidth: 2,
         resize: {
           enabled: true
         }
       }, {
         labels: {
           align: 'right',
           x: -3
         },
         title: {
           text: 'Volume'
         },
         top: '65%',
         height: '35%',
         offset: 0,
         lineWidth: 2
       }],

       tooltip: {
         split: true
       },

       series: [{
         type: 'candlestick',
         name: currencypair,
         data: ohlc,
         dataGrouping: {
           units: groupingUnits
         }
       }, {
         type: 'column',
         name: 'Volume',
         data: volume,
         yAxis: 1,
         dataGrouping: {
           units: groupingUnits
         }
       }]
     });
   });
 }


 function showLoading() {
   $('#theLoader').fadeIn();
 }

 function hideLoading() {
   $('#theLoader').fadeOut();
 }


 function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 }


 function userAuth() {

   if (localStorage.getItem('oauth') != null && localStorage.getItem('oauth') != "") {
     oauthString = "?oauth=" + localStorage.getItem('oauth');
   } else {
     oauthString = "";
   }
   $.ajax({
     url: 'https://stark-island-54204.herokuapp.com/cloud/api/beta/getUserInfo.php' + oauthString,
     complete: function (transport) {

       theResp = $.parseJSON(transport.responseText);
       if (theResp['status'] == 'success') {
         $('#user-name').html(theResp.user[0].email);
         $('#user-balance').html("$" + numberWithCommas(parseFloat(theResp.balanceInfo['totalAssets']).toFixed(2)));
         $("#not-authenticated").addClass("hide");
         $("#authenticated").removeClass("hide");
       } else {
         localStorage.setItem('oauth', theResp.user[0]['oauth']);
         $('#userBalance').html("$" + numberWithCommas(parseFloat(theResp.balanceInfo['totalAssets']).toFixed(2)));
       }

     }
   })
 }


 function login() {


   if ($('#login-email').val().length < 5) {
     alert("Please enter a valid email")
     return;
   }
   if ($('#login-password').val().length < 2) {
     alert("Please enter a valid password")
     return;
   }



   $('#login-form button').html('logging in...');

   $.ajax({
     url: 'https://stark-island-54204.herokuapp.com/cloud/api/beta/login.php',
     data: {
       email: $('#login-email').val(),
       pw: $('#login-password').val()
     },
     method: "POST",
     complete: function (transport) {

       userInfo = $.parseJSON(transport.responseText);
       if (userInfo.status == 'success') {
         $('#btn-login').html('Please wait');
         localStorage.setItem('oauth', userInfo.oauth);
         $("#login-modal").modal('hide');
         userAuth();
       } else {
         alert("Something went wrong. Please try again");
         $('#signup-form button').html('Finish')
       }
     }
   })

 }


 function logout() {
   $.ajax({
     url: 'https://stark-island-54204.herokuapp.com/cloud/api/beta/logout.php',
     complete: function (transport) {
       localStorage.setItem('oauth', "");
       window.location = window.location.href;
     }
   })

 }