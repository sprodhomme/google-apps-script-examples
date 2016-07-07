/**
 * A special function that runs when the spreadsheet is open, used to add a
 * custom menu to the spreadsheet.
 */
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Libellé du sous-menu 1', functionName: 'fonction1'},
    {name: 'Libellé du sous-menu 2', functionName: 'fonction2'},
    // [...]
    {name: 'Libellé du sous-menu n', functionName: 'fonctionN'}
  ];
  spreadsheet.addMenu('Libellé du menu', menuItems);
}
