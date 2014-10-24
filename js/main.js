
$(function() {

    var metrics = Object.keys(data.metrics);
    var states = Object.keys(data.states);

    var $menu = $(".menu ul");
    var $title = $(".header .title");
    var $svgContainer = $(".svg-container");
    var $wrapper = $(".wrapper");

    var $popupHolder = $(".popup-holder");
    var $popup = $(".popup-holder .popup");

    var $years = $(".bottom-bar .years");

    var $hint = $(".top-hint");

    //
    // Open / Hide menu
    //
    var $menuTrigger = $(".menu-trigger");
    $menuTrigger.click(function() {
        $menu.toggleClass("opened");
    });

    //
    // returns actual position n the table (x of all)
    //
    var getScore = function(state, metric, year) {
        var score = 1;
//        console.log(data.states[state]["metrics"], metric);
        var points = data.states[state]["metrics"][metric][year][0];

        for (i in states) {
            var state2 = states[i];
            if (state !== state2) {
            
                if (!data.states[state2]["metrics"][metric]) {
                    alert("Error: missing data: " + state2 + "/" + metric);                            
                }

                var points2 = data.states[state2]["metrics"][metric][year][0];
                if (points < points2) {
                    score++;
                }
            }
        }

        return score;
    };

    //
    // Refresh popup dialog according it's slectors
    //
    var refreshPopup = function(state, metrics) {
        //
        for (var i = 1; i < 3; i++) {
            var $state = $popupHolder.find(".state" + i);
//
            var state = $popupHolder.find(".state-selector-" + i).val();
            var year = $popupYearSelector.val();
            var metricKey = $popupMetricSelector.val();
            var metric = data.metrics[metricKey];

            //deselect / select bottom table rows
            $(".bottom-table .selected").removeClass("selected");
            $(".bottom-table .row-metric-" + metricKey).addClass("selected");

            //fill bottom table data
            $(".bottom-table .row").each(function() {
                var $row = $(this);
                var metricKey = $row.attr("data-metric");
//                console.log(state);
//                console.log(data.states[state].metrics);
//                console.log(metricKey);
//                console.log(data.states[state].metrics[metricKey]);
                $row.find(".subrow-" + i + " .points").html(data.states[state].metrics[metricKey][year][0] + "b");
                $row.find(".subrow-" + i + " .value").html(data.states[state].metrics[metricKey][year][1] + data.metrics[metricKey]["sign"]);
                $row.find(".subrow-" + i + " .bar").css("width", data.states[state].metrics[metricKey][year][0] + "%");
                var str = getScore(state, metricKey, year) + " / " + states.length
                        + " v eu";
                
                if (metricKey !== "EIB") {
                    str = data.states[state].metrics[metricKey][year][1] + " " + metric.sign
                        + ", " + str;
                }
                
                $row.find(".subrow-" + i + " .desc").html(str);
            });

//            console.log($state.find(".flag img").length)

            $state.find(".flag img").attr("src", "img/flags/" + state + ".png");
            
//            $state.find(".name").html(data.states[state]["names"]["cs"]);
//
//            $state.find(".score .value").html(getScore(state, metricKey, year) + " / " + states.length);
//
//            $state.find(".points .value").html(data.states[state].metrics[metricKey][year][0]);
//
//            $state.find(".detail .number").html(data.states[state].metrics[metricKey][year][1] + " " + metric.sign);
//            $state.find(".detail .desc").html(metric.desc_suffix);
        }
    };

    //
    // Open detail dialog, the secons state is always Czech
    //
    var openPopup = function() {

        $popupHolder.show();
        refreshPopup();

        setTimeout(function() {
            var holderHeight = $wrapper.height();
            var popupHeight = $popup.height();
            console.log(holderHeight, popupHeight);
            $popup.css("top", (holderHeight - popupHeight) /2 + "px");
        }, 100);                
    };

    //
    // Close popup
    //
    var closePopup = function(state, metrics) {
        $popupHolder.hide();
        refreshPopup();
    };

    $popupHolder.find(".btn-close").click(function() {
        closePopup()
    });

    $popupHolder.click(function(e) {
        var $target = $(e.target);

        if ($target.is(".popup-holder")) {
            closePopup();
        }
    });

    //
    // Selects a particular metrics - repaint map
    //
    var selectMetric = function() {

        var year = $popupYearSelector.val();
        var metricKey = $popupMetricSelector.val();
        var metric = data.metrics[metricKey];
        $hint.html(metric.info);

        $title.html(metric.name);

        $menu.find(".selected").removeClass("selected")
        $menu.find(".menu-item-" + metricKey).addClass("selected");

        for (i in states) {
            var state = states[i];

            var $state = $(".state-" + state);
            var $statePin = $(".pin-" + state);


            var value = data.states[state]["metrics"][metricKey][year][0];
            $statePin.find(".number").html(value);

            $statePin.find(".left .value").html(value);
            $statePin.find(".percentage").html(value);
            $statePin.find(".comment").html(metric.desc_suffix);

            $state.css("fill", "rgba(255, 0, 0, ." + value + ")");
        }
    };

    //
    // Selects a particular year
    //
    var selectYear = function(year) {
        $popupYearSelector.val(year);
        $(".year").removeClass("selected");
        $(".year" + year).addClass("selected");
    };

    //
    // Copy popup left state elements to right
    //
//    var $stateI = $popupHolder.find(".state1");
//    $stateI.clone().insertAfter($stateI).removeClass("state1").addClass("state2");

    //
    // Fill popup states,  metrics, years
    //
    var $popupStateSelector1 = $popupHolder.find(".state-selector-1").change(function() {
        refreshPopup()
    });
    var $popupStateSelector2 = $popupHolder.find(".state-selector-2").change(function() {
        refreshPopup()
    });
    var $popupYearSelector = $popupHolder.find(".year-selector").change(function() {
        refreshPopup()
    });
    var $popupMetricSelector = $popupHolder.find(".metric-selector").change(function() {
        refreshPopup()
    });

    for (i in states) {
        var state = states[i];

        $popupStateSelector1.append($("<option value='" + state + "'>").addClass("flag-" + state).html(data.states[state]["names"]["cs"]));
        $popupStateSelector2.append($("<option value='" + state + "'>").addClass("flag-").html(data.states[state]["names"]["cs"]));
    }

    $years.addClass("count" + data.years.length);
    for (i in data.years) {
        var year = data.years[i];
        $popupYearSelector.append($("<option>").html(year));

        //years bottom bar
        var $newYear = $years.find(".year-template").clone();
        $newYear.find(".label").html(year);
        $newYear.addClass("year" + year).attr("data-year", year).show().removeClass("year-template").click(function() {
            var $this = $(this);

            selectYear($this.attr("data-year"))
            selectMetric();
        });
        $years.prepend($newYear);
    }

    $years.find(".year-template").remove();

    //add metrics to the selector and the bottom-table

    var $table = $popupHolder.find(".bottom-table");
    var $rowTemplate = $table.find(".row-template").remove();

    var metricsKeys = Object.keys(data.metrics);
    for (i in metricsKeys) {
        var key = metricsKeys[i];
        $popupMetricSelector.append($("<option>").html(data.metrics[key]["name"]).attr("value", key));

        var $newRow = $rowTemplate.clone().appendTo($table).removeClass("row-template").addClass("row").addClass("row-metric-" + key).attr("data-metric", key);
//        $newRow.addClass("state-" + state);
        $newRow.find(".title .short").html(data.metrics[key]["name"]);
        $newRow.find(".title .long").html(data.metrics[key]["info"]);
        $newRow.click(function() {
            $popupMetricSelector.val($(this).attr("data-metric"));
            refreshPopup();
        });
    }

    $rowTemplate.remove();

    //
    // Create numbered pins
    //
    for (i in states) {
        var state = states[i];

        var $state = $(".state-" + state);

        if (
//                (
//                 state == "cyprus"
//                 state == "czech-republic"
//                || state == "estonia"
//                || state == "italy"
//                ) && 
                $state.length > 0) {

            var coordinates = $state[0].getBBox();

            var $statePin = $("<div>").attr("class", "state-pin pin-" + state).html(
                    "<div class=\"number\">" + "</div>"
                    + "<div class=\"detail\">"
                    + "  <div class=\"title\">" + data.states[state]["names"]["cs"] + "</div>"
                    + "  <div class=\"content\">"
                    + "    <div class=\"left\">"
                    + "      <span class=\"value\">100</span>"
                    + "      <span class=\"points\">b</span>"
                    + "    </div>"
                    + "    <span class=\"score\"></span>"
                    + "    <span class=\"percentage\"></span>"
                    + "    <div class=\"comment\">"
                    + "  </div>"
                    + "</div>"
                    + "  <button data-state=\"" + state + "\" class=\"btn btn-detail\">Porovnat</button>"
                    );

            var frame = $(".svg-content")[0].viewBox.baseVal;

//            console.log("2", $(".svg-content")[0].viewBox.baseVal);
            
            var left = data.states[state]["pinFix"]["x"] + (-10) + coordinates.x - (coordinates.width / 2);                        
            var percLeft = left / ((frame.width) / 100);
//            var percLeft = left / ((frame.width - frame.x) / 100);
            
//            console.log("left", left);
//            console.log("width", (frame.width - frame.x) / 100);
//            console.log("perc", left / ((frame.width) / 100) + "%");

            $statePin.css("left", percLeft + "%");
            
            if (percLeft < 20) {
                $statePin.addClass("too-left")
            }
            
            var top = data.states[state]["pinFix"]["y"] + (-80) + coordinates.y - (coordinates.height / 2);                        
            var percTop = top / ((frame.height) / 100);
            
            $statePin.css("top", percTop + "%");           
            
//            $statePin.css("left", 100 / (900 / (coordinates.x + coordinates.width / 2 - data.states[state]["pinFix"]["x"])) + "%");
//            $statePin.css("bottom", 100 - (100 / ((900 * 0.79) / (coordinates.y + coordinates.height / 2 - data.states[state]["pinFix"]["y"]))) + "%");
            
//            $statePin.css("left", "40%");
//            $statePin.css("bottom", "40%");
            
            $svgContainer.append($statePin);
            //$wrapper.append($statePin);
            $statePin.find(".btn-detail").click(function() {
                $popupStateSelector1.val($(this).attr("data-state"));
                $popupStateSelector2.val(data.mainState);
                openPopup();
            });
        }
    }

    for (i in metrics) {
        var metric = metrics[i];
        var label = data.metrics[metric].name;
        var $menuItem = $("<li class=\"menu-item-" + metric + "\">").click(function(e) {
            $popupMetricSelector.val(e.target.getAttribute("data-metric"));
            selectMetric();
            $menu.removeClass("opened");
        }).html(label).attr("data-metric",  metric);

        $menu.append($menuItem);
    }

    //
    // Play years
    //
    var yearTimer;
    var yearPlayScale = 0;
    var $scale = $(".years .scale");
    var $scaleInner = $(".years .scale .inner");
    var $btnPlay = $(".btn-play");
    var $btnStop = $(".btn-stop");
    var $yearsDivs = $(".years .year");
    var yearsCount = $yearsDivs.length;

    var stopYearTimer = function() {
        window.clearTimeout(yearTimer);
        $scaleInner.hide();
        $btnPlay.show();
        $btnStop.hide();
    };

    $btnPlay.click(function() {
        yearPlayScale = 0;
        $btnPlay.hide();
        $btnStop.show();
        $scaleInner.show();
        yearTimer = setInterval(function() {
            yearPlayScale++;
            $scaleInner.css("width", ($scale.width() / 100) * yearPlayScale);

            var correction = (100 / yearsCount / 2);

            if ((yearPlayScale - correction) % (Math.floor(100 / yearsCount)) === 0) {
                //$(".years .year.selected").removeClass("selected");                
                //$($yearsDivs[(yearPlayScale + correction) / (100 / yearsCount) - 1]).addClass("selected");
                selectYear($($yearsDivs[(yearPlayScale + correction) / (100 / yearsCount) - 1]).attr("data-year"))
                selectMetric();
            }

            if (yearPlayScale > 99) {
                stopYearTimer();
            }
        }, 70);
    });

    $(".btn-stop").click(function() {
        stopYearTimer();
    });

    //select first metrics
    selectMetric();
    selectYear($popupYearSelector.val());

    //open dialog 'czech', 'a'
//    openPopup();
    refreshPopup();

    $(".state").click(function() {
        var $state = $(this);

        $(".state.selected").each(function(i, item) {
            this.classList.remove("selected");
        });

//        $("svg").append($state);
        this.classList.add("selected");
    });


});
