function toutTester() {
  testerJson();
  createTimeDrivenTriggers();
  testerShowTriggerIDs();
  testerDeleteAllTriggers();
  testerYouTubeAPI();
  testerGoogle();
  testerExceptionHandling();
  testerDuckduckgo();
  testerQwantAPI();
  testerAPIAvecUserAgent();
}

function testerJson() {
  data = {"id" : "123", "name" : "Objet en mousse"};
  string = JSON.stringify(data)
  Logger.log(string);
  Logger.log(JSON.parse(string));
  Logger.log(data);
}


function createTimeDrivenTriggers() {
  // Trigger every 6 hours.
  ScriptApp.newTrigger('myFunction')
      .timeBased()
      .everyMinutes(1)
      .create();

//  // Trigger every Monday at 09:00.
//  ScriptApp.newTrigger('myFunction')
//      .timeBased()
//      .onWeekDay(ScriptApp.WeekDay.MONDAY)
//      .atHour(9)
//      .create();
}

function myFunction() {
  Logger.log(new Date());
}

function testerShowTriggerIDs() {
  var allTriggers = ScriptApp.getProjectTriggers();
  for(index = 0; index < allTriggers.length; index ++) {
    Logger.log(allTriggers[index].getUniqueId());
  }
  Logger.log(allTriggers.length + " Trigger" + isMultiple_(allTriggers.length) + " présent" + isMultiple_(allTriggers.length) + ".");
}

function testerDeleteAllTriggers() {
  var allTriggers = ScriptApp.getProjectTriggers();
  for(index = 0; index < allTriggers.length; index ++) {
    Logger.log(allTriggers[index].getUniqueId());
    ScriptApp.deleteTrigger(allTriggers[index]);
  }
  Logger.log(allTriggers.length + " Trigger" + isMultiple_(allTriggers.length) + " supprimé" + isMultiple_(allTriggers.length) + ".");
}

function isMultiple_(nombre) {
  return (nombre > 1) ? "s" : "";
}

function deleteTrigger_(triggerId) {
  // Loop over all triggers.
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    // If the current trigger is the correct one, delete it.
    if (allTriggers[i].getUniqueId() == triggerId) {
      ScriptApp.deleteTrigger(allTriggers[i]);
      break;
    }
  }
}

function testerYouTubeAPI() {
  url = 'https://gdata.youtube.com/feeds/api/videos?'
  + 'q=skateboarding+dog'
  + '&start-index=21'
  + '&max-results=10'
  + '&v=2';
  try {
    response = UrlFetchApp.fetch(url);
    Logger.log(response);
  } catch(e) {
    Logger.log(e);
  }
}

function testerGoogle() {
  url = 'https://www.google.com/?'
  + 'q=skateboarding+dog'
  + '&start-index=21'
  + '&max-results=10'
  + '&v=2';
  try {
    response = UrlFetchApp.fetch(url);
    Logger.log(response);
  } catch(e) {
    Logger.log(e);
  }
}

function testerExceptionHandling() {
  url = "https://www.vivrechezmoi.com";
  Logger.log(url + " : " + getStateFromUrl_(url));
  url = "https://www.vivrecheztoi.com";
  Logger.log(url + " : " + getStateFromUrl_(url));
}

function testerDuckduckgo() {
  url = "https://api.duckduckgo.com/?"
  + "q=valley+forge+national+park"
  + "&format=json"
  + "&pretty=1";
  try {
    response = UrlFetchApp.fetch(url, {"muteHttpExceptions" : true});
    donnees = JSON.parse(response.getContentText());
    donnees = donnees.RelatedTopics;
    /*
    {Text=TEXTE, Icon={Height=, Width=, URL=}, FirstURL=DUCKDUCKGO_URL, Result=HTML_A_LINK}
    */
    for(index = 0; index < donnees.length; index ++) {
      Logger.log(donnees[index]);
    }
  } catch(e) {
    Logger.log(e);
  }
}

function testerQwantAPI() {
  url = "https://api.qwant.com/egp/search/web?count=1&q=.php?id=&offset=10";
  try {
    response = UrlFetchApp.fetch(url, {"muteHttpExceptions" : true});
    donnees = JSON.parse(response.getContentText());//Utilities.jsonParse(response.getContentText());
    donnees = donnees.data;
    Logger.log(donnees);
  } catch (e) {
    Logger.log(e);
  }
}

function testerAPIAvecUserAgent() {
  url = "https://api.qwant.com/egp/search/web?count=5&q=google+app+script?id=&offset=10";
  try {
    response = UrlFetchApp.fetch(url, {"muteHttpExceptions" : true, "User-Agent" : "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.4; en-US; rv:1.9.2.2) Gecko/20100316 Firefox/3.6.2"});
    Logger.log(response.getAllHeaders());
    donnees = JSON.parse(response.getContentText());
    donnees = donnees.data;
//    Logger.log(donnees);
  } catch (e) {
    Logger.log(e);
  }
}

function testerAnalyserLigne() {
  row = 3; // Premiere ligne : 2
  Logger.log(row + " : " + JSON.stringify( analyserLigne(row) ) );
}

function testerGetMaxLines() {
  Logger.log(getMaxLines());
}

function testerEval() {
  str = 'x=2';
  Logger.log(eval(str));
  Logger.log(eval('x=3;x*2'));
}

function testerEnvoiEmailASoi() {
    /*
  Format : {projet, environnement, erreur}
  */
  erreurs = [{"projet":"MYP", "environnement":"PREPROD", "erreur":"Accès impossible à l'environnement"}];
  
  objet = "ALERTE - Serveur(s) non disponible(s)";
  destinataire = Session.getActiveUser().getEmail();
  Logger.log(destinataire);
  contenu = "Une ou plusieurs erreurs se sont produites le " + (new Date()).toLocaleString() + " :\n";
  for(index = 0; index < erreurs.length; index++) {
    contenu += "\n projet : " + erreurs[index].projet;
    contenu += "\n environnement : " + erreurs[index].environnement;
    contenu += "\n erreur : " + erreurs[index].erreur;
    contenu += "\n ";
  }
  MailApp.sendEmail(destinataire, objet, contenu);
}