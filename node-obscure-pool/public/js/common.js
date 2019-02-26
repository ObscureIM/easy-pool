const localData = {}

if (typeof google !== 'undefined') {
  google.charts.load('current', {
    packages: ['corechart']
  })
}

$(document).ready(function () {

  hashUpdate()

  $('#searchButton').click(function () {
    searchForTerm($('#searchValue').val())
  })

  $('#checkButton').click(function () {
    checkBalance($('#workAddress').val())
  })

  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
})

function checkBalance(address) {
  $.ajax({
    url: ExplorerConfig.poolApiUrl + "/stats_address",
    dataType: 'json',
    type: 'GET',
    cache: 'false',
    data: {
      address: address

    },
    success: function(header) {

      if(header.stats == undefined) {
        console.log("undefined")
        popUp("The address given is either incorrect or has not mined for this pool yet")
      } else {
        console.log("defined")
        var balance = (header.stats.balance / 100000000).toFixed(2)
        var paidOut = (header.stats.paid / 100000000).toFixed(2)
        var div = document.getElementById("invisibleTable")
        // first lets remove all generated dataTables_empty
        if(document.getElementById("tableID") != undefined) {
          console.log("deleted!")
          div.removeChild(document.getElementById("tableID"))
        }
        var table = document.createElement("table")
        table.id = 'tableID'
        table.classList.add("center")
        for(var j=0;j<2;j++) {
          if(j==0) {
            var tr = document.createElement("tr")

            var th = document.createElement("th")
            th.appendChild(document.createTextNode("Pending Balance"))

            var th2 = document.createElement("th")
            th2.appendChild(document.createTextNode('Paid Out'))

            tr.appendChild(th)
            tr.appendChild(th2)
            table.appendChild(tr)
          }else{
            var tr = document.createElement("tr")

            var th = document.createElement("td")
            th.appendChild(document.createTextNode(balance))

            var th2 = document.createElement("td")
            th2.appendChild(document.createTextNode(paidOut))

            tr.appendChild(th)
            tr.appendChild(th2)
            table.appendChild(tr)

          }
        }
        div.appendChild(table)
      }
      }

  })
}

function hashUpdate() {
  $.ajax({
    url: ExplorerConfig.poolApiUrl + "/stats",
    dataType: 'json',
    type: 'GET',
    cache: 'false',
    success: function(header) {
      var networkHash = getReadableHashRateString(header.network.difficulty / header.config.coinDifficultyTarget);
      var poolHash =  getReadableHashRateString(header.pool.hashrate);
      var percent = (poolHash / networkHash).toFixed(2) * 100

      if(poolHash > networkHash) {
        poolHash = networkHash
        $('#poolHash').text("Pool hashpower: " + getReadableHashRateString2( header.network.difficulty / header.config.coinDifficultyTarget )+ '/s')
        $('#networkHash').text("Network hashpower: " + getReadableHashRateString2( header.network.difficulty / header.config.coinDifficultyTarget )+ '/s')
        $('#percent').text("Netowrk Weight: 100%")
      }else {
        $('#poolHash').text("Pool hashpower: " + getReadableHashRateString2( header.pool.hashrate )+ '/s')
        $('#networkHash').text("Network hashpower: " + getReadableHashRateString2( header.network.difficulty / header.config.coinDifficultyTarget )+ '/s')
        $('#percent').text("Network weight: " + percent + '%')
      }
      setTimeout(hashUpdate,3000)
    },
    error: function() {
      console.log("Failed to get current hash  in ObscurePool")
      setTimeout(hashUpdate,3000)
    }
  })

}
function getReadableHashRateString(hashrate){
    var i = 0;
    var byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH' ];
    while (hashrate > 1000){
        hashrate = hashrate / 1000;
        i++;
    }
    return hashrate.toFixed(2);
}
function getReadableHashRateString2(hashrate){
    var i = 0;
    var byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH' ];
    while (hashrate > 1000){
        hashrate = hashrate / 1000;
        i++;
    }
    return hashrate.toFixed(2) + byteUnits[i];
}

function popUp(error) {
  window.alert(error)
}



function secondsToHumanReadable(seconds) {
  var days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  var hrs = Math.floor(seconds / 3600);
  seconds -= hrs * 3600;
  var mnts = Math.floor(seconds / 60);
  seconds -= mnts * 60;

  return {
    days: days,
    hours: hrs,
    minutes: mnts,
    seconds: seconds
  }
}
