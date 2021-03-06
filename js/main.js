
$(function () {

    var selectedLanguage = (typeof language === "undefined"?data.mainLanguage:language);

    $(".state-label-malta").html(data.states["malta"]["names"][selectedLanguage]);
    $(".state-label-cyprus").html(data.states["cyprus"]["names"][selectedLanguage]);

    $(".btn-download").attr("title", data["strings"][selectedLanguage]["download-instr"]);


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
    $menuTrigger.click(function () {
        $menu.toggleClass("opened");
    });

    //
    // returns actual position n the table (x of all)
    //
    var getScore = function (state, metric, year) {
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
    var refreshPopup = function (state, metrics) {

        for (var i = 1; i < 3; i++) {
            var $state = $popupHolder.find(".state" + i);

            var state = $popupHolder.find(".state-selector-" + i).data("val");
            var year = $popupYearSelector.data("val");
            var metricKey = $popupMetricSelector.data("val");
            var metric = data.metrics[metricKey][selectedLanguage];

            //deselect / select bottom table rows
            $(".bottom-table .selected").removeClass("selected");
            $(".bottom-table .row-metric-" + metricKey).addClass("selected");

            //fill bottom table data
            $(".bottom-table .row").each(function () {
                var $row = $(this);
                var metricKey = $row.attr("data-metric");

                //hide metrics if they are empty
                if (data.states[state].metrics[metricKey][year][0] == -1 || data.states[state].metrics[metricKey][year][0] == -1) {
                  $row.find(".subrow-" + i + " .nodata").show();
                  $row.find(".subrow-" + i + " .desc").hide();
                  $row.find(".subrow-" + i + " .bar").hide();
                } else {
                  $row.find(".subrow-" + i + " .nodata").hide();
                  $row.find(".subrow-" + i + " .desc").show();
                  $row.find(".subrow-" + i + " .bar").show();

                  $row.find(".title .date").html(" (" + (year - data.metrics[metricKey]["delay_statistics"]) + ")");

                  $row.find(".subrow-" + i + " .points").html(data.states[state].metrics[metricKey][year][0] + data["strings"][selectedLanguage]["points-sign"]);
                  $row.find(".subrow-" + i + " .bar").css("width", data.states[state].metrics[metricKey][year][0] + "%");

                  $row.find(".subrow-" + i + " .value").html(data.states[state].metrics[metricKey][year][1] + data.metrics[metricKey][selectedLanguage]["sign"]);
                  var str = getScore(state, metricKey, year) + " / " + states.length + " " + data["strings"][selectedLanguage]["in-EU"];

                  if (metricKey !== "EIB") {
                      str = data.states[state].metrics[metricKey][year][1] + " " + metric.sign + ", " + str;
                  }

                  $row.find(".subrow-" + i + " .desc").html(str);
                }
            });

            $state.find(".flag img").attr("src", "img/flags/" + state + ".png");
        }
    };

    //
    // Open detail dialog, the secons state is always Czech
    //
    var openPopup = function () {

        $popupHolder.show();
        refreshPopup();

        setTimeout(function () {
            var holderHeight = $wrapper.height();
            var popupHeight = $popup.height();
//            console.log(holderHeight, popupHeight);
            $popup.css("top", (holderHeight - popupHeight) / 2 + "px");
        }, 100);
    };

    //
    // Close popup
    //
    var closePopup = function (state, metrics) {
        $popupHolder.hide();
        refreshPopup();
    };

    $popupHolder.find(".btn-close").click(function () {
        closePopup()
    });

    $popupHolder.click(function (e) {
        var $target = $(e.target);

        if ($target.is(".popup-holder")) {
            closePopup();
        }
    });

    //
    // Selects a particular metrics - repaint map
    //
    var selectMetric = function () {

        var year = $popupYearSelector.data("val");
        var metricKey = $popupMetricSelector.data("val");
        var metric = data.metrics[metricKey][selectedLanguage];
        $hint.html(metric.info);

        $title.html(metric.name);

        $menu.find(".selected").removeClass("selected")
        $menu.find(".menu-item-" + metricKey).addClass("selected");

        for (i in states) {
            var state = states[i];

            var $state = $(".state-" + state);
            var $statePin = $(".pin-" + state);

            var points = data.states[state]["metrics"][metricKey][year][0];
            var value = data.states[state]["metrics"][metricKey][year][1];

            if (metricKey === "EIB") {
                value = points;
            }

            $statePin.find(".number").html(points);

            $statePin.find(".left .value").html(points);
            $statePin.find(".percentage").html(points);
            $statePin.find(".comment").html(value + " " + metric.desc_suffix);

            $state.css("fill", "rgba(255, 0, 0, " + points * 0.01 + ")");

            $state.css("content", points);
        }
    };

    //
    // Selects a particular year
    //
    var selectYear = function (year) {
        $popupYearSelector.data("val", year);
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
    var $popupStateSelector1 = $popupHolder.find(".state-selector-1").data("val", data.mainState).prepend($("<div>").html(data.states[data.mainState]["names"][selectedLanguage]).addClass("handler").css("background-image", "url(img/flags/" + data.mainState + ".png)").click(function () {
        $(this).parent().toggleClass("open")
    }));

    var $popupStateSelector2 = $popupHolder.find(".state-selector-2").data("val", data.mainState).prepend($("<div>").html(data.states[data.mainState]["names"][selectedLanguage]).addClass("handler").css("background-image", "url(img/flags/" + data.mainState + ".png)").click(function () {
        $(this).parent().toggleClass("open")
    }));

    var $popupYearSelector = $popupHolder.find(".year-selector").data("val", data.years[0]).append($("<div>").html(data.years[0]).addClass("handler").click(function () {
        $(this).parent().toggleClass("open")
    }));

    var $popupMetricSelector = $popupHolder.find(".metric-selector").data("val", Object.keys(data.metrics)[0]);

    for (i in states) {
        var state = states[i];
        (function (state) {
            $popupStateSelector1.find(".items").append($("<div data-val='" + state + "'>").addClass("flag-" + state).html(data.states[state]["names"][selectedLanguage]).css("background-image", "url(img/flags/" + state + ".png)").click(function () {
                $(this).parent().siblings(".handler").html(data.states[state]["names"][selectedLanguage]).css("background-image", "url(img/flags/" + state + ".png)").parent().toggleClass("open").data("val", state);
                refreshPopup();
            }));
            $popupStateSelector2.find(".items").append($("<div dada-val='" + state + "'>").addClass("flag-").html(data.states[state]["names"][selectedLanguage]).css("background-image", "url(img/flags/" + state + ".png)").click(function () {
                $(this).parent().siblings(".handler").html(data.states[state]["names"][selectedLanguage]).css("background-image", "url(img/flags/" + state + ".png)").parent().toggleClass("open").data("val", state);
                refreshPopup();
            }));
        })(state)
    }

    $years.addClass("count" + data.years.length);
    for (i in data.years) {
        var year = data.years[i];

        (function (year) {
            $popupYearSelector.append($("<div>").html(year).click(function () {
                $(this).siblings(".handler").html(year).parent().toggleClass("open").data("val", year);
                refreshPopup();
            }));

            //years bottom bar
            var $newYear = $years.find(".year-template").clone();
            $newYear.find(".label").html(year);
            $newYear.addClass("year" + year).attr("data-year", year).show().removeClass("year-template").click(function () {
                var $this = $(this);

                selectYear($this.attr("data-year"))
                selectMetric();
            });
            $years.prepend($newYear);

        })(year);
    }

    $years.find(".year-template").remove();

    //add metrics to the selector and the bottom-table

    var $table = $popupHolder.find(".bottom-table");
    var $rowTemplate = $table.find(".row-template").remove();

    var metricsKeys = Object.keys(data.metrics);
    for (i in metricsKeys) {
        var key = metricsKeys[i];

        var $newRow = $rowTemplate.clone().appendTo($table).removeClass("row-template").addClass("row").addClass("row-metric-" + key).attr("data-metric", key);

        $newRow.find(".title .short").html(data.metrics[key][selectedLanguage]["name"] + " <span class=\"date\">.</span>");
        $newRow.find(".title .long").html(data.metrics[key][selectedLanguage]["info"] + " <span class=\"date\">.</span>");
        $newRow.find(".nodata").html(data["strings"][selectedLanguage]["no-data"]);
        $newRow.click(function () {
            $popupMetricSelector.data("val", $(this).attr("data-metric"));
            refreshPopup();
        });
    }

    $rowTemplate.remove();

    //
    // Create numbered pins
    //
    for (i in states) {
        var state = states[i];

        (function (state) {

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
                        + "  <div class=\"title\">" + data.states[state]["names"][selectedLanguage] + "</div>"
                        + "  <div class=\"content\">"
                        + "    <div class=\"left\">"
                        + "      <span class=\"value\">100</span>"
                        + "      <span class=\"points\">" + data["strings"][selectedLanguage]["points-sign"] + "</span>"
                        + "    </div>"
                        + "    <span class=\"score\"></span>"
                        + "    <span class=\"percentage\"></span>"
                        + "    <div class=\"comment\">"
                        + "  </div>"
                        + "</div>"
                        + "  <button data-state=\"" + state + "\" class=\"btn btn-detail\">" + data["strings"][selectedLanguage]["compare"] + "</button>"
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
                $statePin.find(".btn-detail").click(function () {
                    $popupStateSelector1.data("val", $(this).attr("data-state"));

                    $popupStateSelector1.find(".handler").html(data.states[state]["names"][selectedLanguage]).css("background-image", "url(img/flags/" + state + ".png)");
                    $popupStateSelector1.data("val", state);

                    $popupStateSelector2.find(".handler").html(data.states[data.mainState]["names"][selectedLanguage]).css("background-image", "url(img/flags/" + data.mainState + ".png)");
                    $popupStateSelector2.data("val", data.mainState);

                    refreshPopup();
                    openPopup();
                });
            }
        })(state);
    }

    for (i in metrics) {
        var metric = metrics[i];
        var label = data.metrics[metric][selectedLanguage].name;
        var $menuItem = $("<li class=\"menu-item-" + metric + "\">").click(function (e) {
            $popupMetricSelector.data("val", e.target.getAttribute("data-metric"));
            selectMetric();
            refreshPopup();
            $menu.removeClass("opened");
        }).html(label).attr("data-metric", metric);

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

    var stopYearTimer = function () {
        window.clearTimeout(yearTimer);
        $scaleInner.hide();
        $btnPlay.show();
        $btnStop.hide();
    };

    $btnPlay.click(function () {
        yearPlayScale = 0;
        $btnPlay.hide();
        $btnStop.show();
        $scaleInner.show();
        yearTimer = setInterval(function () {
            yearPlayScale++;
            $scaleInner.css("width", ($scale.width() / 100) * yearPlayScale);

            var correction = Math.round(100 / yearsCount / 2);

            // console.log("zde",
            //  (yearPlayScale - correction),
            //  (Math.floor(100 / yearsCount)),
            //  ((yearPlayScale - correction) % (Math.floor(100 / yearsCount)) === 0));

            if ((yearPlayScale - correction) % (Math.floor(100 / yearsCount)) === 0) {
                //$(".years .year.selected").removeClass("selected");
                //$($yearsDivs[(yearPlayScale + correction) / (100 / yearsCount) - 1]).addClass("selected");
                 
                selectYear($($yearsDivs[Math.round((yearPlayScale + correction) / (100 / yearsCount) - 1)]).attr("data-year"))
                selectMetric();
            }

            if (yearPlayScale > 99) {
                stopYearTimer();
            }
        }, 70);
    });

    $(".btn-stop").click(function () {
        stopYearTimer();
    });

    //select first metrics
    selectMetric();
    selectYear($popupYearSelector.data("val"));

    //open dialog 'czech', 'a'
//    openPopup();
    refreshPopup();

    $(".state").click(function () {
        var $state = $(this);

        $(".state.selected").each(function (i, item) {
            this.classList.remove("selected");
        });

//        $("svg").append($state);
        this.classList.add("selected");
    });


});
