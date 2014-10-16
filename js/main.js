
$(function() {

    var metrics = Object.keys(data.metrics);
    var states = Object.keys(data.states);

    var $menu = $(".menu ul");
    var $svgContainer = $(".svg-container");
    var $wrapper = $(".wrapper");

    var $popupHolder = $(".popup-holder");

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
    // Refresh popup dialog according it's slectors
    //
    var refreshPopup = function(state, metrics) {
        //
        for (var i = 1; i < 3; i++) {
            var $state = $popupHolder.find(".state" + i);

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
                $row.find(".subrow-" + i + " .value").html(data.states[state].metrics[metricKey][year][1] + " " + data.metrics[metricKey]["sign"]);
                $row.find(".subrow-" + i + " .bar").css("width", data.states[state].metrics[metricKey][year][0] + "%");
            });

            $state.find(".flag img").attr("src", "img/flags/" + state + ".png");

            $state.find(".score .value").html("0 / " + states.length);

            $state.find(".points .value").html(data.states[state].metrics[metricKey][year][0]);

            $state.find(".detail .number").html(data.states[state].metrics[metricKey][year][1] + " " + metric.sign);
            $state.find(".detail .desc").html(metric.desc_suffix);
        }
    };

    //
    // Open detail dialog, the secons state is always Czech
    //
    var openPopup = function() {
        $popupHolder.show();
        refreshPopup();
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

        for (i in states) {
            var state = states[i];

            var $state = $(".state-" + state);
            var $statePin = $(".pin-" + state);

            var value = data.states[state]["metrics"][metricKey][year][0];
            $statePin.find(".number").html(value);

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
    var $stateI = $popupHolder.find(".state1");
    $stateI.clone().insertAfter($stateI).removeClass("state1").addClass("state2");

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

        $popupStateSelector1.append($("<option value='" + state + "'>").html(data.states[state]["names"]["cs"]));
        $popupStateSelector2.append($("<option value='" + state + "'>").html(data.states[state]["names"]["cs"]));
    }

    $years.addClass("count" + data.years.length);
    for (i in data.years) {
        var year = data.years[i];
        $popupYearSelector.append($("<option>").html(year));

        //years bottom bar
        $years.prepend($years.find(".year-template").clone().addClass("year" + year).attr("data-year", year).show().html("<span class=\"label\">" + year + "</spen>").removeClass("year-template").click(function() {
            var $this = $(this);

            selectYear($this.attr("data-year"))
            selectMetric();
        }));
    }

    //add metrics to the selector and the bottom-table

    var $table = $popupHolder.find(".bottom-table");
    var $rowTemplate = $table.find(".row-template").remove();

    var metricsKeys = Object.keys(data.metrics);
    for (i in metricsKeys) {
        var key = metricsKeys[i];
        $popupMetricSelector.append($("<option>").html(data.metrics[key]["name"]).attr("value", key));

        var $newRow = $rowTemplate.clone().appendTo($table).removeClass("row-template").addClass("row").addClass("row-metric-" + key).attr("data-metric", key);
        $newRow.find(".title").html(data.metrics[key]["name"]);
        $newRow.click(function() {
            $popupMetricSelector.val($(this).attr("data-metric"));
            refreshPopup();
        });
    }

    $rowTemplate.remove();

    //
    // Create numbered pins
    //

//    console.log(states);

    for (i in states) {
        var state = states[i];

        var $state = $(".state-" + state);

        if ($state.length > 0) {

            var coordinates = $state[0].getBBox();

            var $statePin = $("<div>").attr("class", "state-pin pin-" + state).html(
                    "<div class=\"number\">" + "</div>"
                    + "<div class=\"detail\">"
                    + "  <div class=\"title\">R&amp;D Výdaje</div>"
                    + "  <div class=\"content\">"
                    + "    <div class=\"left\">"
                    + "      <span class=\"value\">100</span>"
                    + "      <span class=\"points\">b</span>"
                    + "    </div>"
                    + "    <div class=\"right\">"
                    + "      <div class=\"line\"><span class=\"score\">1/28</span></div>"
                    + "      <div class=\"line\"><span class=\"percentage\">1,4%</span></div>"
                    + "      <div class=\"comment\">Dom. s připojením k internetu</div>"
                    + "    </div>"
                    + "  </div>"
                    + "  <button data-state=\"" + state + "\" class=\"btn btn-detail\">Porovnat</button>"
                    + "</div>"
                    );
            $statePin.css("left", 100 / (700 / (coordinates.x + coordinates.width / 2 - data.states[state]["pinFix"]["x"])) + "%");
            $statePin.css("bottom", 100 - (100 / ((700 * 0.79) / (coordinates.y + coordinates.height / 2 - data.states[state]["pinFix"]["y"]))) + "%");
            //$svgContainer.append($statePin);
            $wrapper.append($statePin);
            $statePin.find(".btn-detail").click(function() {
                $popupStateSelector1.val($(this).attr("data-state"));
                $popupStateSelector2.val(data.mainState);
                openPopup();
            });
        }
    }

    for (i in metrics) {
        var metric = metrics[i];

        var $menuItem = $("<li>").html("<span data-metric=\"" + metric + "\">" + data.metrics[metric].name + "</span>").click(function(e) {
            $popupMetricSelector.val(e.target.getAttribute("data-metric"));
            selectMetric();
        });

        $menu.append($menuItem);
    }

    //select first metrics
    selectMetric();
    selectYear($popupYearSelector.val());

    //open dialog 'czech', 'a'
//    openPopup();
    refreshPopup();

//    for (i in states) {
//        var state = states[i];
//
//    }

//    var metrics = Object.keys(data);
//
//    for (metric in metrics) {
//        
//    } 

    $(".state").click(function() {
        var $state = $(this);

        $(".state.selected").each(function(i, item) {
            this.classList.remove("selected");
        });

//        $("svg").append($state);
        this.classList.add("selected");
    });

});
