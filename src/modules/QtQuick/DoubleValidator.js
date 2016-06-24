registerQmlType({
  module:   'QtQuick',
  name:     'DoubleValidator',
  versions: /.*/,
  baseClass: "Item",
  enums: {
    DoubleValidator: { StandardNotation: 1, ScientificNotation: 2 }
  },
  properties: {
    bottom: { type: "real", initialValue: -Infinity },
    top: { type: "real", initialValue: Infinity },
    decimals: { type: "int", initialValue: 1000 },
    notation: { type: "enum", initialValue: 2 } // DoubleValidator.ScientificNotation
  }
}, class {
  constructor(meta) {
    callSuper(this, meta);

    var standardRegExp   = /^(-|\+)?\s*[0-9]+(\.[0-9]+)?$/;
    var scientificRegExp = /^(-|\+)?\s*[0-9]+(\.[0-9]+)?(E(-|\+)?[0-9]+)?$/;

    this.getRegExpForNotation = (function(notation) {
      switch (notation) {
        case DoubleValidator.ScientificNotation:
          return scientificRegExp;
          break ;
        case DoubleValidator.StandardNotation:
          return standardRegExp;
          break ;
      }
      return null;
    }).bind(this);

    function getDecimalsForNumber(number) {
      if (Math.round(number) != number) {
        var str = '' + number;

        return /\d*$/.exec(str)[0].length;
      }
      return 0;
    }

    this.validate = (function(string) {
      var regExp     = this.getRegExpForNotation(this.notation);
      var acceptable = regExp.test(string.trim());

      if (acceptable) {
        var value    = parseFloat(string);

        acceptable   = this.bottom <= value && this.top >= value;
        acceptable   = acceptable && getDecimalsForNumber(value) <= this.decimals;
      }
      return acceptable;
    }).bind(this);
  }
});
