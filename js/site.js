 $(document).ready(function () {
        $("#datepicker").datepicker({ inline: true });
    });


    function calculate() {
    

        var startDay = $("#datepicker").val();
        var daysToAdd = $("#daysToAdd").val();

        addDaysToCalendar(startDay, daysToAdd, true);

    }

    function addDaysToCalendar(startDate, daysQuantity, isFirstTime) {


        var countryCode = $("#countryCodeTxt").val();
        var isValidCode = IsValidCountryCode(countryCode);

            if(!isValidCode){alert("Country Code is not valid"); return;}

        
        if (!$('#daysToAdd')[0].checkValidity()) {

            alert("days to add is required");
            return;
        }

        if (isFirstTime)
            $("#Canvas").html("");


        var beginingDate = startDate.substring(3, 5);

        var sumTotal = Number(beginingDate) + Number(daysQuantity);
        var daysInCurrentMonth = daysInMonth(startDate.substring(0, 2), startDate.substring(6));

        var result = sumTotal - daysInCurrentMonth;

        //se invoca nuevamente la función
        if (result > 0) {

            createControl(daysQuantity, startDate);

            var auxDate = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1));
            var continiousDate = ("0" + (auxDate.getMonth() + 1)).slice(-2) + "/" + "01" + "/" + auxDate.getFullYear();

            addDaysToCalendar(continiousDate, result, false);

        }

        else {

            createControl(daysQuantity, startDate);
            blockItemsDate(result, daysInCurrentMonth, "#" + daysQuantity);
            return;

        }

        drawWeekend();

        drawHolidays(countryCode);


    }

    function daysInMonth(month, year) {

        return new Date(year, month, 0).getDate();
    }

    function reload_js(src) {

        $('script[src="' + src + '"]').remove();
        $('<script>').attr('src', src).appendTo('head');
    }

    function createControl(name, defaultDate) {

        var htmlTag = "<div id='" + name + "' class='box' />";
        $("#Canvas").append(htmlTag);
        $("#" + name + "").datepicker({
            changeMonth: false,
            changeYear: false,
            yearRange: '1920:2050',
            dateFormat: 'dd-mm-yy',
            defaultDate: new Date(defaultDate)
        });

    }

    function blockItemsDate(counter, daysInMonth, ctrl) {

      
        var limit = (counter * -1);

        for (var i = 0; i < limit; i++) {

            $("a:contains('" + daysInMonth + "')", ctrl).addClass("lock");
            daysInMonth--;
        }

    }

    function IsValidCountryCode(inputCode){

        var validCodes = ["AR","AW","BR","CN","DE","FR","HR","IE","LS","MQ","NO","RU","UA","AO","BE","CA","CO","DK","GB","HU","IN","LU","MX","PL","SI","US","AU","BG","CH","CZ","ES","GT","ID","IT","MG","NL","PR","SK"];


        return $.inArray(inputCode.toUpperCase(),validCodes) > -1;

    }

    function drawWeekend(){

            var daysControls = $("a.ui-state-default:not(.lock)");


            $.each(daysControls, function(i, c){

                var parent = $(c).parent();
                var month = $(parent).data("month");
                var year = $(parent).data("year");
                var day = $(c).text();

                if(isWeekend(day, month, year)){
                    $(c).addClass("weekendColor");
                }else{
                    $(c).addClass("weekdayColor");
                }

                });
    }

    function isWeekend(day,month,year){

        var myDate = new Date();
        myDate.setFullYear(year);
        myDate.setMonth(month);
        myDate.setDate(day);

        if(!(myDate.getDay() % 6)) return true;


        return false;
    }

    function drawHolidays(country){



            $.ajax({
              method: "GET",
              url: "https://holidayapi.com/v1/holidays",
              data: { key:"68faae2a-ff39-4198-aa2d-244c7c36ff1f", year:"2008", country : country }
            })
              .done(function( data ) {
                
                var holidays = data.holidays;
                var daysControls = $("a.ui-state-default:not(.lock)");

                $.each(daysControls, function(i, c){


                      var parent = $(c).parent();
                      var month = $(parent).data("month");
                      var year = $(parent).data("year");
                      var day = $(c).text();

                      var date = year + "-" + ("0" + month + 1).slice(-2) +"-" + ("0" + day).slice(-2);


                      $.each(holidays, function(indx, holiday){

                               if(indx == date)
                                     $(c).removeClass("lock weekendColor weekdayColor").addClass("holidayColor");

                      });


                });
                
              })
                .error(function(){alert("API error, holidays wasn't setted")});

    }

  