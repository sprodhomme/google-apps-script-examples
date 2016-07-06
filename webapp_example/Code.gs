var REQUEST_CODES = {
  "200" : "Réponse OK - le serveur répond correctement.",
  "405" : "Fonction appelée non acceptée par le serveur.",
  "404" : "Not found - l'url pointe sur un élément inexistant ou dont la redirection n'a pas été paramétrée sur le serveur.",
  "500" : "Erreur serveur - probablement un NullPointerException côté back, ou autre Exception bloquante."
}

/**
 * Special function that handles HTTP GET requests to the published web app.
 * @return {HtmlOutput} The HTML page to be served.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Page').evaluate()
      .setTitle('LE TITRE QUI VA BIEN')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function getUnreadEmails() {
  //return GmailApp.getInboxUnreadCount();
  return {"id" : "123", "name" : "Utilisateur"};
}

function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .createMenu('MENU AJOUTE')
      .addItem('Rafraîchir', 'rafraichir')
      .addItem('Programmer tous les jours pour 9:00', 'programmer')
      .addToUi();
}

function programmer() {
//  ScriptApp.newTrigger('rafraichir')
//      .timeBased()
//      .everyDay()
//      .atHour(9)
//      .create();
  
  ScriptApp.newTrigger('rafraichir')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .onWeekDay(ScriptApp.WeekDay.TUESDAY)
      .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
      .onWeekDay(ScriptApp.WeekDay.THURSDAY)
      .onWeekDay(ScriptApp.WeekDay.FRIDAY)
      .atHour(9)
      .create();
}

function rafraichir() {
  var fichier = SpreadsheetApp.openById("ID-UNIQUE-DU-FICHIER-GG-SHEETS");
  SpreadsheetApp.setActiveSpreadsheet(fichier); // !!! obligatoire pour qu'il ne soit pas null !!!
  var feuille = fichier.getSheetByName("NOM_ONGLET");
  feuille.getRange("D2:D").clear().clearNote().setFontColor("black");
  var nbLignes = feuille.getLastRow();
  erreurs = [];
  
  /*
  Format : {"projet", "environnement", "url", "etat"}
  */
  var resultats = [];
  for(index = 2; index < nbLignes+1; index++) {
    feuille.getRange("D" + index).setValue("Appel en cours...");
    environnement = feuille.getRange("B" + index).getValue();
    projet = feuille.getRange("A" + index).getValue();
    url = feuille.getRange("C" + index).getValue();
    reponse = getStateFromUrl_(url);
    feuille.getRange("D" + index).setValue(reponse).setComment(REQUEST_CODES[reponse]);
    if(reponse == 200) {
      feuille.getRange("D" + index).setBackground("#5DBF61").setFontColor("white");
    }
    else {
      feuille.getRange("D" + index).setBackground("#f00");
      erreur = feuille.getRange("D" + index).getValue();
      erreurs.push({"projet" : projet, "environnement" : environnement, "erreur" : erreur});
    }
    resultats.push({"projet":projet,"environnement":environnement,"url":url,"etat":"" + reponse});
  }
  if(erreurs.length > 0) {
    envoyerEmailErreurs_(erreurs);
  }
  laDate = new Date();
  laDate = laDate.toLocaleString();
  feuille.getRange("D1").setValue("Etat au " + laDate.substring(0, laDate.length-8));
  Logger.log(resultats);
  return resultats;
}

function getStateFromUrl_(url) {
  try {
    response = UrlFetchApp.fetch(url, {"muteHttpExceptions" : true, "User-Agent" : "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.4; en-US; rv:1.9.2.2) Gecko/20100316 Firefox/3.6.2"});
    return response.getResponseCode();
  } catch(e) {
    return e;
  }
}

function envoyerEmailErreurs_(erreurs) {
  /*
  Format : {projet, environnement, erreur}
  */
  objet = "ALERTE - Serveur(s) non disponible(s)";
  destinataire = "sprodhomme@santech.fr";
  contenu = "Une ou plusieurs erreurs se sont produites le " + (new Date()).toLocaleString() + " :\n";
  for(index = 0; index < erreurs.length; index++) {
    contenu += "\n projet : " + erreurs[index].projet;
    contenu += "\n environnement : " + erreurs[index].environnement;
    contenu += "\n erreur : " + erreurs[index].erreur;
    contenu += "\n ";
  }
  MailApp.sendEmail(destinataire, objet, contenu);
}
