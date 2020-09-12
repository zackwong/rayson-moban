(function ($) {
  //SELECT控件设置函数
  function setSelectControl(oSelect, iStart, iLength, iIndex) {
    oSelect.empty();

    oSelect.append("<option value='-1'>----</option>");
    for (var i = 0; i < iLength; i++) {
      if ((parseInt(iStart) + i) == iIndex)
        oSelect.append("<option selected='selected' value='" + (parseInt(iStart) + i) + "'>" + (parseInt(iStart) + i) + "</option>");
      else
        oSelect.append("<option value='" + (parseInt(iStart) + i) + "'>" + (parseInt(iStart) + i) + "</option>");
    }
  }

  $.fn.DateSelector = function (options,onDateChange) {
    options = options || {};

    //初始化
    this._options = {
      ctlYearId: null,
      ctlMonthId: null,
      ctlDayId: null,
      defYear: 0,
      defMonth: 0,
      defDay: 0,
      minYear: 1882,
      maxYear: new Date().getFullYear()
    }

    for (var property in options) {
      this._options[property] = options[property];
    }

    this.yearValueId = $("#" + this._options.ctlYearId);
    this.monthValueId = $("#" + this._options.ctlMonthId);
    this.dayValueId = $("#" + this._options.ctlDayId);

    this.Year = this.yearValueId.attr("data");
    this.Month = this.monthValueId.attr("data");
    this.Day = this.dayValueId.attr("data");
    onDateChange(this.Year,this.Month,this.Day)

    this.minYear = parseInt(this._options.minYear);
    this.maxYear = parseInt(this._options.maxYear);

    setSelectControl(this.yearValueId, this.minYear, this.maxYear - this.minYear + 1, this.Year);
    if (this.Month === "-1") {
      setSelectControl(this.monthValueId, 1, 0, -1);
    } else {
      setSelectControl(this.monthValueId, 1, 12, this.Month);
    }
    var daysInMonth = new Date(this.Year, this.Month, 0).getDate(); //获取指定年月的当月天数[new Date(year, month, 0).getDate()]
    if (this.Day > daysInMonth) { this.Day = daysInMonth; };
    if (this.Day === "-1") {
      setSelectControl(this.dayValueId, 1, 0, -1);
    } else {
      setSelectControl(this.dayValueId, 1, daysInMonth, this.Day);
    }

    var oThis = this;
    //绑定控件事件
    this.yearValueId.change(function () {
      oThis.Year = $(this).val();
      if (oThis.Year === "-1") {
        oThis.Day = "-1"
        oThis.Month = "-1"
        setSelectControl(oThis.monthValueId, 1, 0, -1);
        setSelectControl(oThis.dayValueId, 1, 0, -1);
      } else {
        setSelectControl(oThis.monthValueId, 1, 12,
          oThis.Month === "-1" ? 1 : oThis.Month);
        if (oThis.Month === "-1") {
          oThis.Month = 1
        }

        var daysInMonth = new Date(oThis.Year, oThis.Month, 0).getDate();
        if (oThis.Day > daysInMonth) { oThis.Day = daysInMonth; };
        setSelectControl(oThis.dayValueId, 1, daysInMonth,
          oThis.Day === "-1" ? 1 : oThis.Day);
        if (oThis.Day === "-1") {
          oThis.Day = 1
        }
      }
      onDateChange(oThis.Year,oThis.Month,oThis.Day)
    });
    this.monthValueId.change(function () {
      oThis.Month = $(this).val();
      var daysInMonth = new Date(oThis.Year, oThis.Month, 0).getDate();
      if (oThis.Day > daysInMonth) { oThis.Day = daysInMonth; };

      setSelectControl(oThis.dayValueId, 1,
        oThis.Month === "-1" ? 0 : daysInMonth,
        oThis.Month === "-1" ? 0 : (oThis.Day === "-1" ? 1 : oThis.Day));
      if (oThis.Month === "-1") {
        oThis.Day = "-1"
        oThis.Year = "-1"
        setSelectControl(oThis.monthValueId, 1, 0, -1);
        setSelectControl(oThis.yearValueId, oThis.minYear,
          oThis.maxYear - oThis.minYear + 1, -1);
      }
      onDateChange(oThis.Year,oThis.Month,oThis.Day)
    });
    this.dayValueId.change(function () {
      oThis.Day = $(this).val();
      if (oThis.Day === "-1") {
        oThis.Year = "-1"
        oThis.Month = "-1"
        setSelectControl(oThis.dayValueId, 1, 0, -1);
        setSelectControl(oThis.monthValueId, 1, 0, -1);
        setSelectControl(oThis.yearValueId, oThis.minYear, oThis.maxYear - oThis.minYear + 1, -1);
      }
      onDateChange(oThis.Year,oThis.Month,oThis.Day)
    });
  }
})(jQuery);