$(document).ready(function() {
  loadEntries();
});
function loadEntries() {
  var entries = [];
  var entries = JSON.parse(window.localStorage.getItem("entries")) || [];
  displayEntries(entries);
}
function saveEntries(entries) {
  window.localStorage.setItem("entries", JSON.stringify(entries));
}
function displayEntries(entries) {
  let tableBody = $("#entriesTable tbody");
  tableBody.empty();
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];
    if (entry.type !== "Gelöscht") {
      let row = $("<tr></tr>");
      row.append("<td>" + (i + 1) + "</td>");
      let deleteButton = $("<button>Löschen</button>");
      deleteButton.click(function() {
        deleteEntry(i);
      });
      let editButton = $("<button>Bearbeiten</button>");
      editButton.click(function() {
        editEntry(i);
      });
      let actionCell = $("<td></td>");
      actionCell.append(deleteButton);
      actionCell.append(editButton);
      row.append(actionCell);
        if (entry.type == "Nachricht" || entry.type == "Auswahl") {var Color = "blue"} 
        else if (entry.type == "Gold" || entry.type == "Exp"|| entry.type == "Item") {var Color = "purple"} 
        else if (entry.type == "Heilen" || entry.type == "Schaden") {var Color = "green"} 
        else if (entry.type == "BGM" || entry.type == "BGP") {var Color = "darkorange"} 
        else if (entry.type == "Kampf" || entry.type == "Wurf"|| entry.type == "Abenteuer") {var Color = "darkred"} 
        else if (entry.type == "Lose" || entry.type == "Win") {var Color = "black"} 
        else {var Color = "red"}
        row.append("<td style='color: " + Color +";'>" + entry.type + "</td><td style='color: " + Color +";'>" + entry.note + "</td>");
      tableBody.append(row);
    }
  }
}
function deleteEntry(index) {
  let entries = JSON.parse(window.localStorage.getItem("entries")) || [];
  let entry = entries[index];
  entry.type = "Gelöscht";
  entry.note = "";
  saveEntries(entries);
  loadEntries();
}
function refresh() {
  loadEntries();
}
function showAddEntryDialog() {
  let dialog = $("<div></div>").appendTo("body");
  let nameInput = $("<input type='text' placeholder='Name'>").appendTo(dialog);
  let noteInput = $("<input type='text' placeholder='Notizen'>").appendTo(dialog);
  let addButton = $("<button>Hinzufügen</button>").appendTo(dialog);
  addButton.click(function() {
    let entries = JSON.parse(window.localStorage.getItem("entries")) || [];
    let id = entries.length > 0 ? entries[entries.length - 1].id + 1 : 1;
    let name = nameInput.val();
    let note = noteInput.val();
let entry = {
  id: entries.length > 0 ? entries[entries.length - 1].id + 1 : 1,
  name: nameInput.val(),
  note: noteInput.val(),
  type: "Normal"
};
entries.push(entry);
saveEntries(entries);
loadEntries();
dialog.remove();
  });
  let cancelButton = $("<button>Abbrechen</button>").appendTo(dialog);
  cancelButton.click(function() {
    dialog.remove();
  });
}
function handleFileSelect(evt) {
  var files = evt.target.files;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      let entries = JSON.parse(e.target.result);
      saveEntries(entries);
      loadEntries();
    } catch (ex) {
      alert("Error parsing file!");
      console.log(ex);
    }
  };
  reader.readAsText(files[0]);
}
function downloadJSON() {
  let entries = JSON.parse(window.localStorage.getItem("entries")) || [];
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "data.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
function saveNewEntry(entry) {
  let entries = JSON.parse(window.localStorage.getItem("entries")) || [];
  entries.push(entry);
  saveEntries(entries);
}
function editEntry(index) {
  let entries = JSON.parse(window.localStorage.getItem("entries")) || [];
  let entry = entries[index];
    let dialog = $("<div></div>").css({
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "20px",
      border: "1px solid black",
      "border-radius": "5px",
      overflow: "auto",
      maxHeight: "90vh" 
    }).appendTo("body");
      let save = "Speichern";
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//            Bearbeitungsfenster
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ############## Nachricht-Fenster ##############
    if (entry.type == "Nachricht"){
          $("<h1>Nachricht anzeigen</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Zeilensprung, Eckklammern und Anführungsstriche werden automatisch entfernt </span><br>").appendTo(dialog);
          $("<br><span>Nachricht:</span><br>").appendTo(dialog);
          let msgInput = $("<textarea placeholder='Nachricht' rows='10' style='width: 100%;' maxlength='1020'></textarea>").val(entry.msg).appendTo(dialog);
          $("<br><br><span>Sprung nach:</span><br>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let msg = msgInput.val().replace(/[\n<>"]/g, " ");
            let note = noteInput.val();
            let nex = nexInput.val();
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: note,
              msg: msg,
              nex: nex,
              type : "Nachricht"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Auswahl-Fenster ##############
    if (entry.type == "Auswahl"){
          $("<h1>Auswahlfenster</h1><br>").appendTo(dialog); //Überschrift
          $("<br><span>Anzahl der Auswahlmöglichkeiten:  </span>").appendTo(dialog);
          let anzahl = $("<input type='number' placeholder='2' min='2' max='9'>").val(entry.anzahl).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Auswahl 1:  </span>").appendTo(dialog);
          let auswahlAtext = $("<input type='text' placeholder='Text'>").val(entry.auswahlAtext).appendTo(dialog);
          $("<span>Springt nach:</span>").appendTo(dialog);
          let auswahlAnum = $("<input type='number' placeholder='0'>").val(entry.auswahlAnum).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Auswahl 2:  </span>").appendTo(dialog);
          let auswahlBtext = $("<input type='text' placeholder='Text'>").val(entry.auswahlBtext).appendTo(dialog);
          $("<span>Springt nach:</span>").appendTo(dialog);
          let auswahlBnum = $("<input type='number' placeholder='0'>").val(entry.auswahlBnum).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Auswahl 3:  </span>").appendTo(dialog);
          let auswahlCtext = $("<input type='text' placeholder='Text'>").val(entry.auswahlCtext).appendTo(dialog);
          $("<span>Springt nach:</span>").appendTo(dialog);
          let auswahlCnum = $("<input type='number' placeholder='0'>").val(entry.auswahlCnum).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Auswahl 4:  </span>").appendTo(dialog);
          let auswahlDtext = $("<input type='text' placeholder='Text'>").val(entry.auswahlDtext).appendTo(dialog);
          $("<span>Springt nach:</span>").appendTo(dialog);
          let auswahlDnum = $("<input type='number' placeholder='0'>").val(entry.auswahlDnum).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Auswahl 5:  </span>").appendTo(dialog);
          let auswahlEtext = $("<input type='text' placeholder='Text'>").val(entry.auswahlEtext).appendTo(dialog);
          $("<span>Springt nach:</span>").appendTo(dialog);
          let auswahlEnum = $("<input type='number' placeholder='0'>").val(entry.auswahlEnum).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Auswahl 6:  </span>").appendTo(dialog);
          let auswahlFtext = $("<input type='text' placeholder='Text'>").val(entry.auswahlFtext).appendTo(dialog);
          $("<span>Springt nach:</span>").appendTo(dialog);
          let auswahlFnum = $("<input type='number' placeholder='0'>").val(entry.auswahlFnum).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Auswahl 7:  </span>").appendTo(dialog);
          let auswahlGtext = $("<input type='text' placeholder='Text'>").val(entry.auswahlGtext).appendTo(dialog);
          $("<span>Springt nach:</span>").appendTo(dialog);
          let auswahlGnum = $("<input type='number' placeholder='0'>").val(entry.auswahlGnum).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Auswahl 8:  </span>").appendTo(dialog);
          let auswahlHtext = $("<input type='text' placeholder='Text'>").val(entry.auswahlHtext).appendTo(dialog);
          $("<span>Springt nach:</span>").appendTo(dialog);
          let auswahlHnum = $("<input type='number' placeholder='0'>").val(entry.auswahlHnum).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Auswahl 9:  </span>").appendTo(dialog);
          let auswahlItext = $("<input type='text' placeholder='Text'>").val(entry.auswahlItext).appendTo(dialog);
          $("<span>Springt nach:</span>").appendTo(dialog);
          let auswahlInum = $("<input type='number' placeholder='0'>").val(entry.auswahlInum).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen' style='width: 100%;'>").val(entry.note).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              type : "Auswahl",
              anzahl : anzahl.val(),
              auswahlAtext : auswahlAtext.val().replace(/[\n<>"]/g, " "),
              auswahlAnum :  auswahlAnum.val(),
              auswahlBtext : auswahlBtext.val().replace(/[\n<>"]/g, " "),
              auswahlBnum :  auswahlBnum.val(),
              auswahlCtext : auswahlCtext.val().replace(/[\n<>"]/g, " "),
              auswahlCnum :  auswahlCnum.val(),
              auswahlDtext : auswahlDtext.val().replace(/[\n<>"]/g, " "),
              auswahlDnum :  auswahlDnum.val(),
              auswahlEtext : auswahlEtext.val().replace(/[\n<>"]/g, " "),
              auswahlEnum :  auswahlEnum.val(),
              auswahlFtext : auswahlFtext.val().replace(/[\n<>"]/g, " "),
              auswahlFnum :  auswahlFnum.val(),
              auswahlGtext : auswahlGtext.val().replace(/[\n<>"]/g, " "),
              auswahlGnum :  auswahlGnum.val(),
              auswahlHtext : auswahlHtext.val().replace(/[\n<>"]/g, " "),
              auswahlHnum :  auswahlHnum.val(),
              auswahlItext : auswahlItext.val().replace(/[\n<>"]/g, " "),
              auswahlInum :  auswahlInum.val()
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Gold erhalten ##############
    if (entry.type == "Gold"){
          $("<h1>Golderhalten</h1><br>").appendTo(dialog); //Überschrift
          $("<br><br><span>Menge:</span><br>").appendTo(dialog);
          let Gold = $("<input type='number' placeholder='0'>").val(entry.gold).appendTo(dialog);
          $("<br><br><span>Sprung nach:</span><br>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              gold: Gold.val(),
              nex: nexInput.val(),
              type : "Gold"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Exp erhalten ##############
    if (entry.type == "Exp"){
          $("<h1>Erfahrung erhalten</h1><br>").appendTo(dialog); //Überschrift
          $("<br><br><span>Menge:</span><br>").appendTo(dialog);
          let Exp = $("<input type='number' placeholder='0'>").val(entry.Exp).appendTo(dialog);
          $("<br><br><span>Sprung nach:</span><br>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              Exp: Exp.val(),
              nex: nexInput.val(),
              type : "Exp"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Heilung ##############
    if (entry.type == "Heilen"){
          $("<h1>Heilung</h1><br>").appendTo(dialog); //Überschrift
          $("<br><br><span>Menge:</span><br>").appendTo(dialog);
          let Wert = $("<input type='number' placeholder='0'>").val(entry.Wert).appendTo(dialog);
          let Para = $("<select>").appendTo(dialog);
          $("<option>").val("hp").text("Lebenspunkte").appendTo(Para);
          $("<option>").val("mp").text("Magiepunkte").appendTo(Para);
          Para.val(entry.Para);
          $("<br><br><span>Sprung nach:</span><br>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              Para: Para.val(),
              Wert: Wert.val(),
              nex: nexInput.val(),
              type : "Heilen"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Schaden erhalten ##############
    if (entry.type == "Schaden"){
          $("<h1>Schaden erhalten</h1><br>").appendTo(dialog); //Überschrift
          $("<br><br><span>Menge:</span><br>").appendTo(dialog);
          let Dmg = $("<input type='number' placeholder='0'>").val(entry.Dmg).appendTo(dialog);
          $("<br><br><span>Sprung nach:</span><br>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              Dmg: Dmg.val(),
              nex: nexInput.val(),
              type : "Schaden"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Attributsprobe ##############
    if (entry.type == "Wurf"){
          $("<h1>Würfelprobe</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Wurf auf:</span><br>").appendTo(dialog);
          let DiceA = $("<select>").appendTo(dialog);
          let DiceB = $("<select>").appendTo(dialog);
          let DiceC = $("<select>").appendTo(dialog);
          $("<option>").val("em").text("Empathie").appendTo(DiceA);
          $("<option>").val("ch").text("Charisma").appendTo(DiceA);
          $("<option>").val("st").text("Stärke").appendTo(DiceA);
          $("<option>").val("ko").text("Konstitution").appendTo(DiceA);
          $("<option>").val("lo").text("Logik").appendTo(DiceA);
          $("<option>").val("in").text("Intuition").appendTo(DiceA);
          $("<option>").val("re").text("Reaktion").appendTo(DiceA);
          $("<option>").val("ge").text("Geschicklichkeit").appendTo(DiceA);
          $("<option>").val("gd").text("Gedächtnis").appendTo(DiceA);
          $("<option>").val("sd").text("Selbstdisziplin").appendTo(DiceA);
          $("<option>").val("em").text("Empathie").appendTo(DiceB);
          $("<option>").val("ch").text("Charisma").appendTo(DiceB);
          $("<option>").val("st").text("Stärke").appendTo(DiceB);
          $("<option>").val("ko").text("Konstitution").appendTo(DiceB);
          $("<option>").val("lo").text("Logik").appendTo(DiceB);
          $("<option>").val("in").text("Intuition").appendTo(DiceB);
          $("<option>").val("re").text("Reaktion").appendTo(DiceB);
          $("<option>").val("ge").text("Geschicklichkeit").appendTo(DiceB);
          $("<option>").val("gd").text("Gedächtnis").appendTo(DiceB);
          $("<option>").val("sd").text("Selbstdisziplin").appendTo(DiceB);
          $("<option>").val("em").text("Empathie").appendTo(DiceC);
          $("<option>").val("ch").text("Charisma").appendTo(DiceC);
          $("<option>").val("st").text("Stärke").appendTo(DiceC);
          $("<option>").val("ko").text("Konstitution").appendTo(DiceC);
          $("<option>").val("lo").text("Logik").appendTo(DiceC);
          $("<option>").val("in").text("Intuition").appendTo(DiceC);
          $("<option>").val("re").text("Reaktion").appendTo(DiceC);
          $("<option>").val("ge").text("Geschicklichkeit").appendTo(DiceC);
          $("<option>").val("gd").text("Gedächtnis").appendTo(DiceC);
          $("<option>").val("sd").text("Selbstdisziplin").appendTo(DiceC);
          DiceA.val(entry.DiceA);
          DiceB.val(entry.DiceB);
          DiceC.val(entry.DiceC);
          $("<br>").appendTo(dialog);
          $("<span>mit der Schwierigkeit</span>").appendTo(dialog);
          let HG = $("<select>").appendTo(dialog);
          $("<option>").val(5).text("Sehr Leicht").appendTo(HG);
          $("<option>").val(7).text("Einfach").appendTo(HG);
          $("<option>").val(8).text("Normal").appendTo(HG);
          $("<option>").val(10).text("Schwer").appendTo(HG);
          $("<option>").val(12).text("Sehr Schwer").appendTo(HG);
          $("<option>").val(14).text("Äußerst Schwer").appendTo(HG);
          $("<option>").val(16).text("Blanker Leichtsinn").appendTo(HG);
          $("<option>").val(18).text("Absurd").appendTo(HG);
          HG.val(entry.HG)
          $("<br>").appendTo(dialog);
          $("<br><span>Erfolgreich - Sprung nach:</span>").appendTo(dialog);
          let nexInputA = $("<input type='number' placeholder='0'>").val(entry.nexA).appendTo(dialog);
          $("<br><span>Misserfolg - Sprung nach: </span>").appendTo(dialog);
          let nexInputB = $("<input type='number' placeholder='0'>").val(entry.nexB).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              nexA: nexInputA.val(),
              nexB: nexInputB.val(),
              DiceA: DiceA.val(),
              DiceB: DiceB.val(),
              DiceC: DiceC.val(),
              HG: HG.val(),
              type : "Wurf"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Abenteuer Überprüfung ##############
    if (entry.type == "Abenteuer"){
          $("<h1>Abenteuer Überprüfung</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Zeilensprung, Eckklammern und Anführungsstriche werden automatisch entfernt </span><br>").appendTo(dialog);
          $("<br><br><span>Überprüfung:</span>").appendTo(dialog);
          let Wert = $("<select>").appendTo(dialog);
          $("<option>").val("light").text("Lichtquelle").appendTo(Wert);
          $("<option>").val("magic").text("Magie entdecken").appendTo(Wert);
          $("<option>").val("bind").text("Fesseln").appendTo(Wert);
          $("<option>").val("fall").text("Herunterfallen").appendTo(Wert);
          $("<option>").val("mind").text("Gedanken lesen").appendTo(Wert);
          $("<option>").val("lang-dwarvish").text("Sprache verstehen: Zwergisch").appendTo(Wert);
          $("<option>").val("lang-sylvan").text("Sprache verstehen: Sylvanisch").appendTo(Wert);
          $("<option>").val("lang-orc").text("Sprache verstehen: Orkisch").appendTo(Wert);
          $("<option>").val("lang-gnomish").text("Sprache verstehen: Gnomisch").appendTo(Wert);
          $("<option>").val("lang-draconic").text("Sprache verstehen: Drakonisch").appendTo(Wert);
          $("<option>").val("lang-infernal").text("Sprache verstehen: Infernal").appendTo(Wert);
          $("<option>").val("lang-celestial").text("Sprache verstehen: Celestisch").appendTo(Wert);
          $("<option>").val("lang-primordial").text("Sprache verstehen: Urtümlich").appendTo(Wert);
          $("<option>").val("lang-giant").text("Sprache verstehen: Riesisch").appendTo(Wert);
          Wert.val(entry.Wert)
          let table = $("<table>").appendTo(dialog);
          let Spalte1Reihe1 = $("<td>").append($("<h3>").text("Zutreffend"));
          let Spalte2Reihe1 = $("<td>").append($("<h3>").text("Nicht Zutreffend"));
          let row1 = $("<tr>").append(Spalte1Reihe1, Spalte2Reihe1).appendTo(table);
          let msgAtext = $("<span>Nachricht:</span><br>");
          let msgInputA = $("<textarea placeholder='Nachricht' rows='10' style='width: 90%;' maxlength='1020'></textarea>").val(entry.msgA).appendTo(dialog);
          let sprungA = $("<br><br><span>Sprung nach:</span><br>");
          let nexA = $("<input type='number' placeholder='0'>").val(entry.nexA);
          let Spalte1Reihe2 = $("<td>").append(msgAtext, msgInputA, sprungA, nexA).appendTo(table);
          let msgBtext = $("<span>Nachricht:</span><br>");
          let msgInputB = $("<textarea placeholder='Nachricht' rows='10' style='width: 90%;' maxlength='1020'></textarea>").val(entry.msgB).appendTo(dialog);
          let sprungB = $("<br><br><span>Sprung nach:</span><br>");
          let nexB = $("<input type='number' placeholder='0'>").val(entry.nexB);
          let Spalte2Reihe2 = $("<td>").append(msgBtext, msgInputB, sprungB, nexB).appendTo(table);
          let row2 = $("<tr>").append(Spalte1Reihe2, Spalte2Reihe2).appendTo(table);
          table.appendTo(dialog);
          $("<br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              msgA: msgInputA.val().replace(/[\n<>"]/g, " "),
              msgB: msgInputB.val().replace(/[\n<>"]/g, " "),
              nexA: nexA.val(),
              nexB: nexB.val(),
              Wert: Wert.val(),
              type : "Abenteuer"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Spiel verloren ##############
    if (entry.type == "Lose"){
          $("<h1>Game Over</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              type : "Lose"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Spiel verloren ##############
    if (entry.type == "Win"){
          $("<h1>Spiel gewonnen</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              type : "Win"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Zeit steuern ##############
    if (entry.type == "Zeit steuern"){
          $("<h1>Zeit steuern</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Aktion:</span>").appendTo(dialog);
          let Ctr = $("<select>").appendTo(dialog);
          $("<option>").val("set").text("Zeit setzen").appendTo(Ctr);
          $("<option>").val("sub").text("Zeit verstreichen").appendTo(Ctr);
          Ctr.val(entry.Ctr)
          $("<br>").appendTo(dialog);
          $("<br><span>Zeitwert:</span>").appendTo(dialog);
          let Zeit = $("<input type='number' placeholder='0'>").val(entry.Zeit).appendTo(dialog);
          $("<br><br><span>Sprung nach:</span>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              Zeit : Zeit.val(),
              nex : nexInput.val(),
              Ctr : Ctr.val(),
              type : "Zeit steuern"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Zeitkontrolle ##############
    if (entry.type == "Zeitkontrolle"){
          $("<h1>Zeitkontrolle</h1><br>").appendTo(dialog); //Überschrift
          $("<br><span>Wenn Zeit vorhanden, springen nach:</span>").appendTo(dialog);
          let nexInputA = $("<input type='number' placeholder='0'>").val(entry.nexA).appendTo(dialog);
          $("<br><span>Wenn keine Zeit vorhanden, springen nach:</span>").appendTo(dialog);
          let nexInputB = $("<input type='number' placeholder='0'>").val(entry.nexB).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          $("<span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              nexA : nexInputA.val(),
              nexB : nexInputB.val(),
              type : "Zeitkontrolle"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Schalter Steuern ##############
    if (entry.type == "Schalter steuern"){
          $("<h1>Schalter steuern</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Bitte eine ID zwischen 1 bis 99 verwenden, sonst entstehen Fehlermeldungen!<br></span>").appendTo(dialog);
          $("<span>ID:</span>").appendTo(dialog);
          let ID = $("<input type='number' placeholder='0' min='1' max='99' maxlength='2'>").val(entry.ID).appendTo(dialog);
          let Ctr = $("<select>").appendTo(dialog);
          $("<option>").val("true").text("AN").appendTo(Ctr);
          $("<option>").val("false").text("AUS").appendTo(Ctr);
          Ctr.val(entry.Ctr)
          $("<br><br><span>Sprung nach:</span>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              ID : ID.val(),
              nex : nexInput.val(),
              Ctr : Ctr.val(),
              type : "Schalter steuern"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Schalterkontrolle ##############
    if (entry.type == "Schalterkontrolle"){
          $("<h1>Schalterkontrolle</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Bitte eine ID zwischen 1 bis 99 verwenden, sonst entstehen Fehlermeldungen!<br></span>").appendTo(dialog);
          $("<span>Schalter ID:</span>").appendTo(dialog);
          let ID = $("<input type='number' placeholder='0' min='1' max='99' maxlength='2'>").val(entry.ID).appendTo(dialog);
          $("<br><span>Wenn Schalter AN, springen nach:</span>").appendTo(dialog);
          let nexInputA = $("<input type='number' placeholder='0'>").val(entry.nexA).appendTo(dialog);
          $("<br><span>Wenn Schalter AUS, springen nach:</span>").appendTo(dialog);
          let nexInputB = $("<input type='number' placeholder='0'>").val(entry.nexB).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          $("<span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              ID : ID.val(),
              nexA : nexInputA.val(),
              nexB : nexInputB.val(),
              type : "Schalterkontrolle"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Punkte steuern ##############
    if (entry.type == "Punkte steuern"){
          $("<h1>Punkte steuern</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Bitte eine ID zwischen 1 bis 99 verwenden, sonst entstehen Fehlermeldungen!<br></span>").appendTo(dialog);
          $("<span>ID:</span>").appendTo(dialog);
          let ID = $("<input type='number' placeholder='0' min='1' max='99' maxlength='2'>").val(entry.ID).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          let Ctr = $("<select>").appendTo(dialog);
          $("<option>").val("set").text("Setzen auf").appendTo(Ctr);
          $("<option>").val("sub").text("Verringern um").appendTo(Ctr);
          $("<option>").val("add").text("Erhöhen um").appendTo(Ctr);
          Ctr.val(entry.Ctr)
          let Wert = $("<input type='number' placeholder='0'>").val(entry.Wert).appendTo(dialog);
          $("<br><br><span>Sprung nach:</span>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              ID : ID.val(),
              nex : nexInput.val(),
              Wert: Wert.val(),
              Ctr : Ctr.val(),
              type : "Punkte steuern"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Punktekontrolle ##############
    if (entry.type == "Punktekontrolle"){
          $("<h1>Schalterkontrolle</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Bitte eine ID zwischen 1 bis 99 verwenden, sonst entstehen Fehlermeldungen!<br></span>").appendTo(dialog);
          $("<span>ID:</span>").appendTo(dialog);
          let ID = $("<input type='number' placeholder='0' min='1' max='99' maxlength='2'>").val(entry.ID).appendTo(dialog);
          $("<br><span>Zielwert</span>").appendTo(dialog);
          let Goal = $("<input type='number' placeholder='0'>").val(entry.Goal).appendTo(dialog);
          $("<br><br><span>Punktespeicher ist gleich oder mehr als der Zielwert, springe nach:</span>").appendTo(dialog);
          let nexInputA = $("<input type='number' placeholder='0'>").val(entry.nexA).appendTo(dialog);
          $("<br>").appendTo(dialog);
          $("<br><span>Punktespeicher ist weniger als der Zielwert, springe nach:<br></span>").appendTo(dialog);
          let nexInputB = $("<input type='number' placeholder='0'>").val(entry.nexB).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          $("<span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br><br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              ID : ID.val(),
              Goal : Goal.val(),
              nexA : nexInputA.val(),
              nexB : nexInputB.val(),
              type : "Punktekontrolle"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Hintergrundmusik ##############
    if (entry.type == "BGM"){
          $("<h1>Hintergrundmusik</h1><br>").appendTo(dialog); //Überschrift
          $("<br><br><span>Tittel:</span><br>").appendTo(dialog);
          let bgm = $("<input type='text' placeholder='Tittel'>").val(entry.bgm).appendTo(dialog);
          $("<span>.ogg</span>").appendTo(dialog);
          $("<br><br><span>Sprung nach:</span><br>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              bgm: bgm.val(),
              nex: nexInput.val(),
              type : "BGM"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Hintergrundmusik ##############
    if (entry.type == "BGP"){
          $("<h1>Hintergrundgrafik</h1><br>").appendTo(dialog); //Überschrift
          $("<br><br><span>Tittel:</span><br>").appendTo(dialog);
          let bgp = $("<input type='text' placeholder='Tittel'>").val(entry.bgp).appendTo(dialog);
          $("<span>.png</span>").appendTo(dialog);
          $("<span><br>Die Grafik muss 1000x740 Pixel Groß sein!</span>").appendTo(dialog);
          $("<br><br><span>Sprung nach:</span><br>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              bgp: bgp.val(),
              nex: nexInput.val(),
              type : "BGP"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Item erhalten ##############
    if (entry.type == "Item"){
          $("<h1>Item erhalten</h1><br>").appendTo(dialog); //Überschrift
          let Item = $("<select>").appendTo(dialog);
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          $("<option>").val("HealS").text("Heilung|Lebenstrank S").appendTo(Item);
          $("<option>").val("HealM").text("Heilung|Lebenstrank M").appendTo(Item);
          $("<option>").val("HealL").text("Heilung|Lebenstrank L").appendTo(Item);
          $("<option>").val("ManaS").text("Heilung|Manatrank S").appendTo(Item);
          $("<option>").val("ManaM").text("Heilung|Manatrank M").appendTo(Item);
          $("<option>").val("ManaL").text("Heilung|Manatrank L").appendTo(Item);
          $("<option>").val("Adv_Fackel").text("Abenteuer|Fackel").appendTo(Item);
          $("<option>").val("Adv_Laterne").text("Abenteuer|Laterne").appendTo(Item);
          $("<option>").val("Adv_Schreib").text("Abenteuer|Schreibwerkzeug").appendTo(Item);
          $("<option>").val("Adv_Seil").text("Abenteuer|Seil").appendTo(Item);
          $("<option>").val("Scroll_Magic").text("Schriftrolle-Abenteuer|Magie entdecken").appendTo(Item);
          $("<option>").val("Scroll_Mind").text("Schriftrolle-Abenteuer|Gedanken hören").appendTo(Item);
          $("<option>").val("Scroll_Fall").text("Schriftrolle-Abenteuer|Federfall").appendTo(Item);
          $("<option>").val("Scroll_Water").text("Schriftrolle-Kampf|Wasser").appendTo(Item);
          $("<option>").val("Scroll_Venom").text("Schriftrolle-Kampf|Gift").appendTo(Item);
          $("<option>").val("Scroll_Acid").text("Schriftrolle-Kampf|Säure").appendTo(Item);
          $("<option>").val("Scroll_Dark").text("Schriftrolle-Kampf|Dunkel").appendTo(Item);
          $("<option>").val("Scroll_Flash").text("Schriftrolle-Kampf|Blitz").appendTo(Item);
          $("<option>").val("Scroll_Sonic").text("Schriftrolle-Kampf|Schall").appendTo(Item);
          $("<option>").val("Scroll_Fire").text("Schriftrolle-Kampf|Feuer").appendTo(Item);
          $("<option>").val("Scroll_Arcan").text("Schriftrolle-Kampf|Neutral").appendTo(Item);
          $("<option>").val("Scroll_Soul").text("Schriftrolle-Kampf|Geist").appendTo(Item);
          $("<option>").val("Chest_Equip").text("Truhe|Ausrüstung").appendTo(Item);
          $("<option>").val("Chest_Medic").text("Truhe|Medizin").appendTo(Item);
          $("<option>").val("Chest_Tool").text("Truhe|Werkzeug").appendTo(Item);
          $("<option>").val("Chest_Alchemy").text("Truhe|Alchemie").appendTo(Item);
          $("<option>").val("Chest_Scroll").text("Truhe|Schriftrolle").appendTo(Item);
          $("<option>").val("Scroll_Emphty").text("Herstellen|Schriftrolle|Leer").appendTo(Item);
          $("<option>").val("String_Garn").text("Herstellen|Fäden|Garn").appendTo(Item);
          $("<option>").val("String_Seide").text("Herstellen|Fäden|Seide").appendTo(Item);
          $("<option>").val("Leather_Shadow").text("Herstellen|Leder|Schattenleder").appendTo(Item);
          $("<option>").val("Leather_Lizard").text("Herstellen|Leder|Reptilienhaut").appendTo(Item);
          $("<option>").val("Leather_Wing").text("Herstellen|Leder|Flügelhaut").appendTo(Item);
          $("<option>").val("Leather_Wolf").text("Herstellen|Leder|Wolfsleder").appendTo(Item);
          $("<option>").val("Leather_Trol").text("Herstellen|Leder|Trollhaut").appendTo(Item);
          $("<option>").val("Leather_Bling").text("Herstellen|Leder|Schimmerleder").appendTo(Item);
          $("<option>").val("Leather_Light").text("Herstellen|Leder|Lichtleder").appendTo(Item);
          $("<option>").val("Leather_Bear").text("Herstellen|Leder|Bärenleder").appendTo(Item);
          $("<option>").val("Leather_Demon").text("Herstellen|Leder|Dämonenhaut").appendTo(Item);
          $("<option>").val("Leather_Mystic").text("Herstellen|Leder|Mystisches Leder").appendTo(Item);
          $("<option>").val("Leather_Dragon").text("Herstellen|Leder|Drachenhaut").appendTo(Item);
          $("<option>").val("Leather_Unicorn").text("Herstellen|Leder|Einhornleder").appendTo(Item);
          $("<option>").val("Leather_Cat").text("Herstellen|Leder|Katzenhaut").appendTo(Item);
          $("<option>").val("Leather_Horse").text("Herstellen|Leder|Pferdeleder").appendTo(Item);
          $("<option>").val("Mushroom_Vettel").text("Herstellen|Pilz|Vettelkappe").appendTo(Item);
          $("<option>").val("Mushroom_Schimmel").text("Herstellen|Pilz|Schimmelschwamm").appendTo(Item);
          $("<option>").val("Mushroom_Bitterling").text("Herstellen|Pilz|Bitterling").appendTo(Item);
          $("<option>").val("Mushroom_Frost").text("Herstellen|Pilz|Frostkappe").appendTo(Item);
          $("<option>").val("Mushroom_Süßling").text("Herstellen|Pilz|Süßling").appendTo(Item);
          $("<option>").val("Mushroom_Schleier").text("Herstellen|Pilz|Schleierhaube").appendTo(Item);
          $("<option>").val("Mushroom_Waldglanz").text("Herstellen|Pilz|Waldglanzschwamm").appendTo(Item);
          $("<option>").val("Mushroom_Schimmerhut").text("Herstellen|Pilz|Schimmerhut").appendTo(Item);
          $("<option>").val("Mushroom_Zimt").text("Herstellen|Pilz|Zimtspore").appendTo(Item);
          $("<option>").val("Mushroom_Champion").text("Herstellen|Pilz|Champion").appendTo(Item);
          $("<option>").val("Mushroom_Knolle").text("Herstellen|Pilz|Knollenpilz").appendTo(Item);
          $("<option>").val("Mushroom_Rinde").text("Herstellen|Pilz|Rindenpilz").appendTo(Item);
          $("<option>").val("Mushroom_Stein").text("Herstellen|Pilz|Steinpilz").appendTo(Item);
          $("<option>").val("Mushroom_Moos").text("Herstellen|Pilz|Moosherzkappe").appendTo(Item);
          $("<option>").val("Mushroom_Grün").text("Herstellen|Pilz|Grünkappe").appendTo(Item);
          $("<option>").val("Mushroom_Fly").text("Herstellen|Pilz|Fliegenpilz").appendTo(Item);
          $("<option>").val("Ingot_Eisen").text("Herstellen|Erz|Eisen").appendTo(Item);
          $("<option>").val("Ingot_Zinn").text("Herstellen|Erz|Zinn").appendTo(Item);
          $("<option>").val("Ingot_Mithril").text("Herstellen|Erz|Mithril").appendTo(Item);
          $("<option>").val("Ingot_Grün").text("Herstellen|Erz|Grünschatten").appendTo(Item);
          $("<option>").val("Ingot_Zink").text("Herstellen|Erz|Zink").appendTo(Item);
          $("<option>").val("Ingot_Himmel").text("Herstellen|Erz|Himmelseisen").appendTo(Item);
          $("<option>").val("Ingot_Schimmer").text("Herstellen|Erz|Schimmerstahl").appendTo(Item);
          $("<option>").val("Ingot_Obsidian").text("Herstellen|Erz|Obsidian").appendTo(Item);
          $("<option>").val("Ingot_Titan").text("Herstellen|Erz|Titan").appendTo(Item);
          $("<option>").val("Ingot_Stahl").text("Herstellen|Erz|Stahl").appendTo(Item);
          $("<option>").val("Ingot_Bronze").text("Herstellen|Erz|Bronze").appendTo(Item);
          $("<option>").val("Ingot_Graphit").text("Herstellen|Erz|Graphit").appendTo(Item);
          $("<option>").val("Ingot_Kupfer").text("Herstellen|Erz|Kupfer").appendTo(Item);
          $("<option>").val("Ingot_Gold").text("Herstellen|Erz|Gold").appendTo(Item);
          $("<option>").val("Ingot_Messing").text("Herstellen|Erz|Bluterz").appendTo(Item);
          $("<option>").val("Dust_Holz").text("Herstellen|Staub|Holzmehl").appendTo(Item);
          $("<option>").val("Dust_Wing").text("Herstellen|Staub|Flügelstaub").appendTo(Item);
          $("<option>").val("Dust_Sun").text("Herstellen|Staub|Sonnenpulver").appendTo(Item);
          $("<option>").val("Dust_Zucker").text("Herstellen|Staub|Zucker").appendTo(Item);
          $("<option>").val("Dust_Geist").text("Herstellen|Staub|Geisterstaub").appendTo(Item);
          $("<option>").val("Dust_Magic").text("Herstellen|Staub|Magieasche").appendTo(Item);
          $("<option>").val("Dust_Fee").text("Herstellen|Staub|Feenstaub").appendTo(Item);
          $("<option>").val("Dust_Phönix").text("Herstellen|Staub|Phönixasche").appendTo(Item);
          $("<option>").val("Wood_Birke").text("Herstellen|Holz|Birke").appendTo(Item);
          $("<option>").val("Wood_Wisper").text("Herstellen|Holz|Wisper").appendTo(Item);
          $("<option>").val("Wood_Buche").text("Herstellen|Holz|Buche").appendTo(Item);
          $("<option>").val("Wood_Ahorn").text("Herstellen|Holz|Ahorn").appendTo(Item);
          $("<option>").val("Wood_Eibe").text("Herstellen|Holz|Eibe").appendTo(Item);
          $("<option>").val("Wood_Erle").text("Herstellen|Holz|Erle").appendTo(Item);
          $("<option>").val("Wood_Morgen").text("Herstellen|Holz|Morgentau").appendTo(Item);
          $("<option>").val("Wood_Kiefer").text("Herstellen|Holz|Kiefer").appendTo(Item);
          $("<option>").val("Wood_Weide").text("Herstellen|Holz|Weide").appendTo(Item);
          $("<option>").val("Wood_Schatten").text("Herstellen|Holz|Schatten").appendTo(Item);
          $("<option>").val("Wood_Eiche").text("Herstellen|Holz|Eiche").appendTo(Item);
          $("<option>").val("Wood_Zephyr").text("Herstellen|Holz|Zephyr").appendTo(Item);
          $("<option>").val("Wood_Mond").text("Herstellen|Holz|Mondschleier").appendTo(Item);
          $("<option>").val("Wood_Zwielicht").text("Herstellen|Holz|Zwielicht").appendTo(Item);
          $("<option>").val("Wood_Nebel").text("Herstellen|Holz|Nebel").appendTo(Item);
          $("<option>").val("Wood_Pinie").text("Herstellen|Holz|Pinie").appendTo(Item);
          $("<option>").val("Crystal_Amethyst").text("Herstellen|Kristall|Amethyst").appendTo(Item);
          $("<option>").val("Crystal_Levenduan").text("Herstellen|Kristall|Levenduan").appendTo(Item);
          $("<option>").val("Crystal_Bernstein").text("Herstellen|Kristall|Bernstein").appendTo(Item);
          $("<option>").val("Crystal_Lapis").text("Herstellen|Kristall|Lapis").appendTo(Item);
          $("<option>").val("Crystal_Saphir").text("Herstellen|Kristall|Saphir").appendTo(Item);
          $("<option>").val("Crystal_Rubin").text("Herstellen|Kristall|Rubin").appendTo(Item);
          $("<option>").val("Crystal_Karneol").text("Herstellen|Kristall|Karneol").appendTo(Item);
          $("<option>").val("Crystal_Smaragd").text("Herstellen|Kristall|Smaragd").appendTo(Item);
          $("<option>").val("Bone_Schädel").text("Herstellen|Knochen|Schädel").appendTo(Item);
          $("<option>").val("Bone_Riese").text("Herstellen|Knochen|Riesenknochen").appendTo(Item);
          $("<option>").val("Bone_Drache").text("Herstellen|Knochen|Drachenknochen").appendTo(Item);
          $("<option>").val("Bone_Leicht").text("Herstellen|Knochen|Leichter Knochen").appendTo(Item);
          $("<option>").val("Bone_Tier").text("Herstellen|Knochen|Tierknochen").appendTo(Item);
          $("<option>").val("Bone_Nekro").text("Herstellen|Knochen|Nekrotischer Knochen").appendTo(Item);
          $("<option>").val("Bone_Monster").text("Herstellen|Knochen|Monsterknochen").appendTo(Item);
          $("<option>").val("Bone_Gerippe").text("Herstellen|Knochen|Gerippe").appendTo(Item);
          $("<option>").val("Leaf_Zitrone").text("Herstellen|Kraut|Zitronenmelisse").appendTo(Item);
          $("<option>").val("Leaf_Pfefferminze").text("Herstellen|Kraut|Pfefferminze").appendTo(Item);
          $("<option>").val("Leaf_Baldrian").text("Herstellen|Kraut|Baldrian").appendTo(Item);
          $("<option>").val("Leaf_Lungen").text("Herstellen|Kraut|Lungenkraut").appendTo(Item);
          $("<option>").val("Leaf_Ritter").text("Herstellen|Kraut|Rittersporn").appendTo(Item);
          $("<option>").val("Leaf_Brennnessel").text("Herstellen|Kraut|Brennnessel").appendTo(Item);
          $("<option>").val("Leaf_Seidelbast").text("Herstellen|Kraut|Seidenblast").appendTo(Item);
          $("<option>").val("Leaf_Eisenhut").text("Herstellen|Kraut|Eisenhut").appendTo(Item);
          $("<option>").val("Leaf_Melisse").text("Herstellen|Kraut|Melisse").appendTo(Item);
          $("<option>").val("Leaf_Alraune").text("Herstellen|Kraut|Alraune").appendTo(Item);
          $("<option>").val("Leaf_Efeu").text("Herstellen|Kraut|Efeu").appendTo(Item);
          $("<option>").val("Leaf_Johanneskraut").text("Herstellen|Kraut|Johanneskraut").appendTo(Item);
          $("<option>").val("Leaf_Taubnessel").text("Herstellen|Kraut|Taubnessel").appendTo(Item);
          $("<option>").val("Leaf_Beinwell").text("Herstellen|Kraut|Beinwell").appendTo(Item);
          $("<option>").val("Leaf_Schierling").text("Herstellen|Kraut|Schierling").appendTo(Item);
          $("<option>").val("Leaf_Fingerhut").text("Herstellen|Kraut|Fingerhut").appendTo(Item);
          Item.val(entry.Item)
          $("<br><br><span>Sprung nach:</span><br>").appendTo(dialog);
          let nexInput = $("<input type='number' placeholder='0'>").val(entry.nex).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              Item: Item.val(),
              nex: nexInput.val(),
              type : "Item"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Item erhalten ##############
    if (entry.type == "Kampf"){
          $("<h1>Kampf</h1><br>").appendTo(dialog); //Überschrift
          $("<span>Kampf gegen: </span>").appendTo(dialog);
          let Mob = $("<select>").appendTo(dialog);
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          $("<option>").val("Demilich").text("A|Demilich").appendTo(Mob);
          $("<option>").val("OldDragon_Fire").text("A|Alter Drache (Feuer)").appendTo(Mob);
          $("<option>").val("OldDragon_Water").text("A|Alter Drache (Wasser)").appendTo(Mob);
          $("<option>").val("OldDragon_Shock").text("A|Alter Drache (Blitz)").appendTo(Mob);
          $("<option>").val("OldDragon_Acid").text("A|Alter Drache (Säure)").appendTo(Mob);
          $("<option>").val("OldDragon_Venom").text("A|Alter Drache (Gift)").appendTo(Mob);
          $("<option>").val("ArchAngel_Sword").text("A|Erzengel (Schwert)").appendTo(Mob);
          $("<option>").val("ArchAngel_Spear").text("A|Erzengel (Speer)").appendTo(Mob);
          $("<option>").val("ArchAngel_Bow").text("A|Erzengel (Bogen)").appendTo(Mob);
          $("<option>").val("DeathKnight").text("A|Todesritter").appendTo(Mob);
          $("<option>").val("Treant").text("B|Treant").appendTo(Mob);
          $("<option>").val("Dragon_Fire").text("B|Drache (Feuer)").appendTo(Mob);
          $("<option>").val("Drache_Water").text("B|Drache (Wasser)").appendTo(Mob);
          $("<option>").val("Drache_Shock").text("B|Drache (Blitz)").appendTo(Mob);
          $("<option>").val("Drache_Acid").text("B|Drache (Säure)").appendTo(Mob);
          $("<option>").val("Drache_Venom").text("B|Drache (Gift)").appendTo(Mob);
          $("<option>").val("Angel_Sword").text("B|Engel (Schwert)").appendTo(Mob);
          $("<option>").val("Angel_Spear").text("B|Engel (Speer)").appendTo(Mob);
          $("<option>").val("Angel_Bow").text("B|Engel (Bogen)").appendTo(Mob);
          $("<option>").val("Hydra").text("B|Hydra").appendTo(Mob);
          $("<option>").val("IceGiant").text("B|Eisriese").appendTo(Mob);
          $("<option>").val("FireGiant").text("B|Feuerriese").appendTo(Mob);
          $("<option>").val("Chimare").text("C|Chimäre").appendTo(Mob);
          $("<option>").val("Unicorn").text("C|Einhorn").appendTo(Mob);
          $("<option>").val("Elementar_Fire").text("C|Elementar (Feuer)").appendTo(Mob);
          $("<option>").val("Elementar_Water").text("C|Elementar (Wasser)").appendTo(Mob);
          $("<option>").val("Elementar_Shok").text("C|Elementar (Blitz)").appendTo(Mob);
          $("<option>").val("Groundshark").text("C|Landhai").appendTo(Mob);
          $("<option>").val("Slamander").text("C|Salamander").appendTo(Mob);
          $("<option>").val("Troll").text("C|Troll").appendTo(Mob);
  //        $("<option>").val("Treant").text("C|Treant").appendTo(Mob);
          $("<option>").val("Wyern").text("C|Wyern").appendTo(Mob);
          $("<option>").val("Basilisk").text("D|Basilisk").appendTo(Mob);
          $("<option>").val("Coutail").text("D|Treant").appendTo(Mob);
          $("<option>").val("Demon").text("D|Dämon").appendTo(Mob);
          $("<option>").val("BabyDragon_Fire").text("D|Baby Drache (Feuer)").appendTo(Mob);
          $("<option>").val("BabyDragon_Water").text("D|Baby Drache (Wasser)").appendTo(Mob);
          $("<option>").val("BabyDragon_Shock").text("D|Baby Drache (Blitz)").appendTo(Mob);
          $("<option>").val("BabyDragon_Acid").text("D|Baby Drache (Säure)").appendTo(Mob);
          $("<option>").val("BabyDragon_Venom").text("D|Baby Drache (Gift)").appendTo(Mob);
          $("<option>").val("FireSkull").text("D|Flammenschädel").appendTo(Mob);
          $("<option>").val("Ghost").text("D|Geist").appendTo(Mob);
          $("<option>").val("Hellhound").text("D|Höllenhund").appendTo(Mob);
          $("<option>").val("Lamia").text("D|Lamia").appendTo(Mob);
          $("<option>").val("Manticor").text("D|Mantikor").appendTo(Mob);
          $("<option>").val("Nightmare").text("D|Nachtmahr").appendTo(Mob);
          $("<option>").val("DeadFairy").text("D|Todesfee").appendTo(Mob);
          $("<option>").val("Vettel").text("D|Vettel").appendTo(Mob);
          $("<option>").val("Yeti").text("D|Yeti").appendTo(Mob);
          $("<option>").val("Dryade").text("E|Dryade").appendTo(Mob);
          $("<option>").val("Gargoyle").text("E|Gargoyle").appendTo(Mob);
          $("<option>").val("Ghoul").text("E|Ghoul").appendTo(Mob);
          $("<option>").val("Griffon").text("E|Greif").appendTo(Mob);
          $("<option>").val("Harpye").text("E|Harpyie").appendTo(Mob);
          $("<option>").val("WilloWisp").text("E|Irrlicht").appendTo(Mob);
          $("<option>").val("Mimik").text("E|Mimik").appendTo(Mob);
          $("<option>").val("Pegasus").text("E|Pegasus").appendTo(Mob);
          $("<option>").val("Bear").text("E|Bär").appendTo(Mob);
          $("<option>").val("Lion").text("E|Löwe").appendTo(Mob);
          $("<option>").val("Wolf").text("E|Wolf").appendTo(Mob);
          $("<option>").val("Tiger").text("E|Tieger").appendTo(Mob);
          $("<option>").val("Kobold").text("F|Kobold").appendTo(Mob);
          $("<option>").val("Pixi").text("F|Pixie").appendTo(Mob);
          $("<option>").val("Satyr").text("F|Satyr").appendTo(Mob);
          $("<option>").val("Shadow").text("F|Schatten").appendTo(Mob);
          $("<option>").val("Skeletton").text("F|Skelett").appendTo(Mob);
          $("<option>").val("Zombi").text("F|Zombie").appendTo(Mob);
          $("<option>").val("Crocodile").text("F|Krokodil").appendTo(Mob);
          $("<option>").val("Bard_Rapier").text("NPC|Barde (Rapier)").appendTo(Mob);
          $("<option>").val("Bard_Bow").text("NPC|Barde (Bogen)").appendTo(Mob);
          $("<option>").val("Bard_Sword").text("NPC|Barde (Schwert)").appendTo(Mob);
          $("<option>").val("Bard_Dagger").text("NPC|Barde (Dolch)").appendTo(Mob);
          $("<option>").val("Bandit_Sword").text("NPC|Bandit (Schwert)").appendTo(Mob);
          $("<option>").val("Bandit_Claymore").text("NPC|Bandit (Zweihänder)").appendTo(Mob);
          $("<option>").val("Bandit_Bow").text("NPC|Bandit (Bogen)").appendTo(Mob);
          $("<option>").val("Bandit_Crossbow").text("NPC|Bandit (Armbrust)").appendTo(Mob);
          $("<option>").val("Bandit_Axe").text("NPC|Bandit (Axt)").appendTo(Mob);
          $("<option>").val("Druid_Venom").text("NPC|Druide (Gift)").appendTo(Mob);
          $("<option>").val("Druid_Acid").text("NPC|Druide (Säure)").appendTo(Mob);
          $("<option>").val("Druid_Sonic").text("NPC|Druide (Schall)").appendTo(Mob);
          $("<option>").val("Thief_Dagger").text("NPC|Dieb (Dolch)").appendTo(Mob);
          $("<option>").val("Thief_Sword").text("NPC|Dieb (Schwert)").appendTo(Mob);
          $("<option>").val("Thief_Crossbow").text("NPC|Dieb (Armbrust)").appendTo(Mob);
          $("<option>").val("Thief_Bow").text("NPC|Dieb (Bogen)").appendTo(Mob);
     //     $("<option>").val("Thief_Dagger").text("NPC|Dieb (Dolch)").appendTo(Mob);
          $("<option>").val("Mage_Fire").text("NPC|Magier (Feuer)").appendTo(Mob);
          $("<option>").val("Mage_Water").text("NPC|Magier (Wasser)").appendTo(Mob);
          $("<option>").val("Mage_Shock").text("NPC|Magier (Blitz)").appendTo(Mob);
          $("<option>").val("Monk").text("NPC|Mönch").appendTo(Mob);
          $("<option>").val("Priest_Rod").text("NPC|Priester (Stab)").appendTo(Mob);
          $("<option>").val("Priest_Rapier").text("NPC|Priester (Rapier)").appendTo(Mob);
          $("<option>").val("Knight_Sword").text("NPC|Ritter (Schwert)").appendTo(Mob);
          $("<option>").val("Knight_Claymore").text("NPC|Ritter (Zweihänder)").appendTo(Mob);
          $("<option>").val("Guard_Sword").text("NPC|Wache (Schwert)").appendTo(Mob);
          $("<option>").val("Guard_Spear").text("NPC|Wache (Speer)").appendTo(Mob);
          $("<option>").val("Guard_Halberd").text("NPC|Wache (Hallebarde)").appendTo(Mob);
          $("<option>").val("Guard_Crossbow").text("NPC|Wache (Armbrust)").appendTo(Mob);
          $("<option>").val("Ranger_Bow").text("NPC|Waldläufer (Bogen)").appendTo(Mob);
          $("<option>").val("Ranger_Crossbow").text("NPC|Waldläufer (Armbrust)").appendTo(Mob);
          $("<option>").val("Viking_Axe").text("NPC|Wikinger (Axt)").appendTo(Mob);
          $("<option>").val("Viking_Claymore").text("NPC|Wikinger (Zweihänder)").appendTo(Mob);
          $("<option>").val("Viking_Bow").text("NPC|WIkinger (Bogen)").appendTo(Mob);
          Mob.val(entry.Mob)
          $("<br><br><span>Kampf gewonen, sprung nach:</span><br>").appendTo(dialog);
          let nexA = $("<input type='number' placeholder='0'>").val(entry.nexA).appendTo(dialog);
          $("<br><br><span>Vor Kampf geflüchtet, sprung nach:</span><br>").appendTo(dialog);
          let nexB = $("<input type='number' placeholder='0'>").val(entry.nexB).appendTo(dialog);
          $("<br><br><span>Kampf verloren, sprung nach:</span><br>").appendTo(dialog);
          let nexC = $("<input type='number' placeholder='0'>").val(entry.nexC).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              Mob: Mob.val(),
              nexA: nexA.val(),
              nexB: nexB.val(),
              nexC: nexC.val(),
              type : "Kampf"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Klasse ##############
    if (entry.type == "Klasse"){
          $("<h1>Klasse</h1>").appendTo(dialog); //Überschrift
          $("<span>Spieler ist...</span><br>").appendTo(dialog);
          $("<br><span>Barde, sprung nach:</span>").appendTo(dialog);
          let Barde = $("<input type='number' placeholder='0'>").val(entry.Barde).appendTo(dialog);
          $("<br><span>Dieb, sprung nach:</span>").appendTo(dialog);
          let Dieb = $("<input type='number' placeholder='0'>").val(entry.Dieb).appendTo(dialog);
          $("<br><span>Kleriker, sprung nach:</span>").appendTo(dialog);
          let Kleriker = $("<input type='number' placeholder='0'>").val(entry.Kleriker).appendTo(dialog);
          $("<br><span>Krieger, sprung nach:</span>").appendTo(dialog);
          let Krieger = $("<input type='number' placeholder='0'>").val(entry.Krieger).appendTo(dialog);
          $("<br><span>Waldläufer, sprung nach:</span>").appendTo(dialog);
          let Waldlaufer = $("<input type='number' placeholder='0'>").val(entry.Waldlaufer).appendTo(dialog);
          $("<br><span>Magier, sprung nach:</span>").appendTo(dialog);
          let Magier = $("<input type='number' placeholder='0'>").val(entry.Magier).appendTo(dialog);
          $("<br><span>Mönch, sprung nach:</span>").appendTo(dialog);
          let Monch = $("<input type='number' placeholder='0'>").val(entry.Monch).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              Barde : Barde.val(),
              Dieb : Dieb.val(),
              Kleriker : Kleriker.val(),
              Krieger : Krieger.val(),
              Waldlaufer : Waldlaufer.val(),
              Magier : Magier.val(),
              Monch : Monch.val(),
              type : "Klasse"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Pantheon ##############
    if (entry.type == "Pantheon"){
          $("<h1>Pantheon</h1>").appendTo(dialog); //Überschrift
          $("<span>Spieler glaubt an...</span><br>").appendTo(dialog);
          $("<br><span>Aegir, sprung nach:</span>").appendTo(dialog);
          let Aegir = $("<input type='number' placeholder='0'>").val(entry.Aegir).appendTo(dialog);
          $("<br><span>Balder, sprung nach:</span>").appendTo(dialog);
          let Balder = $("<input type='number' placeholder='0'>").val(entry.Balder).appendTo(dialog);
          $("<br><span>Forseti, sprung nach:</span>").appendTo(dialog);
          let Forseti = $("<input type='number' placeholder='0'>").val(entry.Forseti).appendTo(dialog);
          $("<br><span>Freya, sprung nach:</span>").appendTo(dialog);
          let Freya = $("<input type='number' placeholder='0'>").val(entry.Freya).appendTo(dialog);
          $("<br><span>Freyr, sprung nach:</span>").appendTo(dialog);
          let Freyr = $("<input type='number' placeholder='0'>").val(entry.Freyr).appendTo(dialog);
          $("<br><span>Frigg, sprung nach:</span>").appendTo(dialog);
          let Frigg = $("<input type='number' placeholder='0'>").val(entry.Frigg).appendTo(dialog);
          $("<br><span>Heimdall, sprung nach:</span>").appendTo(dialog);
          let Heimdall = $("<input type='number' placeholder='0'>").val(entry.Heimdall).appendTo(dialog);
          $("<br><span>Hel, sprung nach:</span>").appendTo(dialog);
          let Hel = $("<input type='number' placeholder='0'>").val(entry.Hel).appendTo(dialog);
          $("<br><span>Hermodr, sprung nach:</span>").appendTo(dialog);
          let Hermodr = $("<input type='number' placeholder='0'>").val(entry.Hermodr).appendTo(dialog);
          $("<br><span>Loki, sprung nach:</span>").appendTo(dialog);
          let Loki = $("<input type='number' placeholder='0'>").val(entry.Loki).appendTo(dialog);
          $("<br><span>Njord, sprung nach:</span>").appendTo(dialog);
          let Njord = $("<input type='number' placeholder='0'>").val(entry.Njord).appendTo(dialog);
          $("<br><span>Odin, sprung nach:</span>").appendTo(dialog);
          let Odin = $("<input type='number' placeholder='0'>").val(entry.Odin).appendTo(dialog);
          $("<br><span>Odur, sprung nach:</span>").appendTo(dialog);
          let Odur = $("<input type='number' placeholder='0'>").val(entry.Odur).appendTo(dialog);
          $("<br><span>Sif, sprung nach:</span>").appendTo(dialog);
          let Sif = $("<input type='number' placeholder='0'>").val(entry.Sif).appendTo(dialog);
          $("<br><span>Skadi, sprung nach:</span>").appendTo(dialog);
          let Skadi = $("<input type='number' placeholder='0'>").val(entry.Skadi).appendTo(dialog);
          $("<br><span>Surtur, sprung nach:</span>").appendTo(dialog);
          let Surtur = $("<input type='number' placeholder='0'>").val(entry.Surtur).appendTo(dialog);
          $("<br><span>Thor, sprung nach:</span>").appendTo(dialog);
          let Thor = $("<input type='number' placeholder='0'>").val(entry.Thor).appendTo(dialog);
          $("<br><span>Thrym, sprung nach:</span>").appendTo(dialog);
          let Thrym = $("<input type='number' placeholder='0'>").val(entry.Thrym).appendTo(dialog);
          $("<br><span>Tyr, sprung nach:</span>").appendTo(dialog);
          let Tyr = $("<input type='number' placeholder='0'>").val(entry.Tyr).appendTo(dialog);
          $("<br><span>Uller, sprung nach:</span>").appendTo(dialog);
          let Uller = $("<input type='number' placeholder='0'>").val(entry.Uller).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              Aegir : Aegir.val(),
              Balder : Balder.val(),
              Forseti : Forseti.val(),
              Freya : Freya.val(),
              Freyr : Freyr.val(),
              Frigg : Frigg.val(),
              Heimdall : Heimdall.val(),
              Hel : Hel.val(),
              Hermodr : Hermodr.val(),
              Loki : Loki.val(),
              Njord : Njord.val(),
              Odin : Odin.val(),
              Odur : Odur.val(),
              Sif : Sif.val(),
              Skadi : Skadi.val(),
              Surtur : Surtur.val(),
              Thor : Thor.val(),
              Thrym : Thrym.val(),
              Tyr : Tyr.val(),
              Uller : Uller.val(),
              type : "Pantheon"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Volk ##############
    if (entry.type == "Volk"){
          $("<h1>Volk</h1>").appendTo(dialog); //Überschrift
          $("<span>Spieler ist vom Volk...</span><br>").appendTo(dialog);
          $("<br><span>Mensch, sprung nach:</span>").appendTo(dialog);
          let Mensch = $("<input type='number' placeholder='0'>").val(entry.Mensch).appendTo(dialog);
          $("<br><span>Elf, sprung nach:</span>").appendTo(dialog);
          let Elf = $("<input type='number' placeholder='0'>").val(entry.Elf).appendTo(dialog);
          $("<br><span>Zwerg, sprung nach:</span>").appendTo(dialog);
          let Zwerg = $("<input type='number' placeholder='0'>").val(entry.Zwerg).appendTo(dialog);
          $("<br><span>Ork, sprung nach:</span>").appendTo(dialog);
          let Ork = $("<input type='number' placeholder='0'>").val(entry.Ork).appendTo(dialog);
          $("<br><span>Gnom, sprung nach:</span>").appendTo(dialog);
          let Gnom = $("<input type='number' placeholder='0'>").val(entry.Gnom).appendTo(dialog);
          $("<br><span>Goblin, sprung nach:</span>").appendTo(dialog);
          let Goblin = $("<input type='number' placeholder='0'>").val(entry.Goblin).appendTo(dialog);
          $("<br><span>Teufelsbrut, sprung nach:</span>").appendTo(dialog);
          let Teufelsbrut = $("<input type='number' placeholder='0'>").val(entry.Teufelsbrut).appendTo(dialog);
          $("<br><span>Lichtgehüllt, sprung nach:</span>").appendTo(dialog);
          let Lichtgehullt = $("<input type='number' placeholder='0'>").val(entry.Lichtgehullt).appendTo(dialog);
          $("<br><span>Vampir, sprung nach:</span>").appendTo(dialog);
          let Vampir = $("<input type='number' placeholder='0'>").val(entry.Vampir).appendTo(dialog);
          $("<br><span>Lycanthrop, sprung nach:</span>").appendTo(dialog);
          let Lycanthrop = $("<input type='number' placeholder='0'>").val(entry.Lycanthrop).appendTo(dialog);
          $("<br><span>Echsenmensch, sprung nach:</span>").appendTo(dialog);
          let Echsenmensch = $("<input type='number' placeholder='0'>").val(entry.Echsenmensch).appendTo(dialog);
          $("<br><span>Halbelf, sprung nach:</span>").appendTo(dialog);
          let Halbelf = $("<input type='number' placeholder='0'>").val(entry.Halbelf).appendTo(dialog);
          $("<br><span>Halbork, sprung nach:</span>").appendTo(dialog);
          let Halbork = $("<input type='number' placeholder='0'>").val(entry.Halbork).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              Mensch : Mensch.val(),
              Elf : Elf.val(),
              Zwerg : Zwerg.val(),
              Ork : Ork.val(),
              Gnom : Gnom.val(),
              Goblin : Goblin.val(),
              Teufelsbrut : Teufelsbrut.val(),
              Lichtgehullt : Lichtgehullt.val(),
              Vampir : Vampir.val(),
              Lycanthrop : Lycanthrop.val(),
              Echsenmensch : Echsenmensch.val(),
              Halbelf : Halbelf.val(),
              Halbork : Halbork.val(),
              type : "Volk"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Herkunft ##############
    if (entry.type == "Herkunft"){
          $("<h1>Volk</h1>").appendTo(dialog); //Überschrift
          $("<span>Spieler kommt vom...</span><br>").appendTo(dialog);
          $("<br><span>Gebirge, sprung nach:</span>").appendTo(dialog);
          let Gebirge = $("<input type='number' placeholder='0'>").val(entry.Gebirge).appendTo(dialog);
          $("<br><span>Küste, sprung nach:</span>").appendTo(dialog);
          let Kuste = $("<input type='number' placeholder='0'>").val(entry.Kuste).appendTo(dialog);
          $("<br><span>Land, sprung nach:</span>").appendTo(dialog);
          let Land = $("<input type='number' placeholder='0'>").val(entry.Land).appendTo(dialog);
          $("<br><span>Normade, sprung nach:</span>").appendTo(dialog);
          let Normade = $("<input type='number' placeholder='0'>").val(entry.Normade).appendTo(dialog);
          $("<br><span>Stadt, sprung nach:</span>").appendTo(dialog);
          let Stadt = $("<input type='number' placeholder='0'>").val(entry.Stadt).appendTo(dialog);
          $("<br><span>Wald, sprung nach:</span>").appendTo(dialog);
          let Wald = $("<input type='number' placeholder='0'>").val(entry.Wald).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              Gebirge : Gebirge.val(),
              Kuste : Kuste.val(),
              Land : Land.val(),
              Normade : Normade.val(),
              Stadt : Stadt.val(),
              Wald : Wald.val(),
              type : "Herkunft"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }
// ############## Zufall ##############
    if (entry.type == "Zufall"){
          $("<h1>Zufall</h1>").appendTo(dialog); //Überschrift
          $("<span>Jede Möglichkeit hat eine Wahrscheinlichkeit von 10% <br>Also wohin soll gesprungen werden?</span><br>").appendTo(dialog);
          let NexA = $("<input type='number' placeholder='0'>").val(entry.NexA).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let NexB = $("<input type='number' placeholder='0'>").val(entry.NexB).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let NexC = $("<input type='number' placeholder='0'>").val(entry.NexC).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let NexD = $("<input type='number' placeholder='0'>").val(entry.NexD).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let NexE = $("<input type='number' placeholder='0'>").val(entry.NexE).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let NexF = $("<input type='number' placeholder='0'>").val(entry.NexF).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let NexG = $("<input type='number' placeholder='0'>").val(entry.NexG).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let NexH = $("<input type='number' placeholder='0'>").val(entry.NexH).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let NexI = $("<input type='number' placeholder='0'>").val(entry.NexI).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let NexJ = $("<input type='number' placeholder='0'>").val(entry.NexJ).appendTo(dialog);
          $("<br><br><span>Notiz:</span><br>").appendTo(dialog);
          let noteInput = $("<input type='text' placeholder='Notizen'>").val(entry.note).appendTo(dialog);
          $("<br>").appendTo(dialog);
          let saveButton = $("<button>" + save +"</button>").appendTo(dialog);
          saveButton.click(function() {
            let editedEntry = {
              id: entry.id,
              name: entry.name,
              note: noteInput.val(),
              NexA : NexA.val(),
              NexB : NexB.val(),
              NexC : NexC.val(),
              NexD : NexD.val(),
              NexE : NexE.val(),
              NexF : NexF.val(),
              NexG : NexG.val(),
              NexH : NexH.val(),
              NexI : NexI.val(),
              NexJ : NexJ.val(),
              type : "Zufall"
            };
            entries[index] = editedEntry;
            saveEntries(entries);
            loadEntries();
            dialog.remove();
            location.reload();
          });
    }




// ############## Endverarbeitung ##############
  let cancelButton = $("<button>Abbrechen</button>").appendTo(dialog);
  cancelButton.click(function() {
    dialog.remove();
    location.reload();
  });
  $("body > div").not(dialog).remove();
}
function addEntry(Type) {
  let entries = JSON.parse(window.localStorage.getItem("entries")) || [];
  var newEntry = {
    "type": Type,
    "note": " "
  };
  entries.push(newEntry);
  saveEntries(entries);
  loadEntries();
  editEntry(entries.length - 1)
}
function newdata() {
    let entries = [];
    saveEntries(entries);
    loadEntries();
  loadEntries();
}
function exporter() {
    let dialog = $("<div></div>").css({
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "20px",
      border: "1px solid black",
      "border-radius": "5px",
      overflow: "auto",
      maxHeight: "90vh" 
    }).appendTo("body");
let user = JSON.parse(window.localStorage.getItem("user")) || [];
          $("<h1>Exportieren</h1><br>").appendTo(dialog); //Überschrift      
          $("<span>Author:</span>").appendTo(dialog);
          let author = $("<input type='text' placeholder='Author' style='width: 100%;'>").val(user.author).appendTo(dialog);
          $("<br><br>").appendTo(dialog);  
          $("<span>Tittel:</span>").appendTo(dialog);
          let titel = $("<input type='text' placeholder='Tittel' style='width: 100%;'>").val(user.titel).appendTo(dialog);
          $("<br>").appendTo(dialog); 
          $("<br><span>Beschreibung:</span>").appendTo(dialog);
          let beschreibung = $("<textarea placeholder='Nachricht' rows='10' style='width: 100%;'></textarea>").val(user.beschreibung).appendTo(dialog);
          $("<br>").appendTo(dialog);  
          let saveButton = $("<button>Exportieren</button>").appendTo(dialog);
          saveButton.click(function() {
          let zufall = Math.floor(Math.random() * (999999999999 - 0 + 1))
          var kampf = false;
          var abenteuer = false;
          var dice = false;
          var GAME = ""
          var FEHLER = []
          var Grafiken_Raw = []
          var Sounds_Raw = []
          var Mobs_Raw = []
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//            Exportierung
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  let entries = JSON.parse(window.localStorage.getItem("entries")) || [];
  for (let i = 0; i < entries.length; i++){
    var aktuell = entries[i]
    var EINTRAG = "x"
// ############## Gelöschter Eintrag ##############
    if (aktuell.type == "Gelöscht") { var EINTRAG = " "}
// ############## Nachricht-Fenster ##############
    if (aktuell.type == "Nachricht") { var EINTRAG = "<msg><" + aktuell.msg + "><" + aktuell.nex + ">"}
// ############## Auswahl-Fenster ##############
    if (aktuell.type == "Auswahl") {
        if (aktuell.anzahl == 2) {var EINTRAG = "<choice><" + aktuell.anzahl + "><" + aktuell.auswahlAtext + "><" + aktuell.auswahlAnum + "><" + aktuell.auswahlBtext + "><" + aktuell.auswahlBnum + ">"}
        else if (aktuell.anzahl == 3) {var EINTRAG = "<choice><" + aktuell.anzahl + "><" + aktuell.auswahlAtext + "><" + aktuell.auswahlAnum + "><" + aktuell.auswahlBtext + "><" + aktuell.auswahlBnum + "><" + aktuell.auswahlCtext + "><" + aktuell.auswahlCnum + ">"}
        else if (aktuell.anzahl == 4) {var EINTRAG = "<choice><" + aktuell.anzahl + "><" + aktuell.auswahlAtext + "><" + aktuell.auswahlAnum + "><" + aktuell.auswahlBtext + "><" + aktuell.auswahlBnum + "><" + aktuell.auswahlCtext + "><" + aktuell.auswahlCnum + "><" + aktuell.auswahlDtext + "><" + aktuell.auswahlDnum + ">"}
        else if (aktuell.anzahl == 5) {var EINTRAG = "<choice><" + aktuell.anzahl + "><" + aktuell.auswahlAtext + "><" + aktuell.auswahlAnum + "><" + aktuell.auswahlBtext + "><" + aktuell.auswahlBnum + "><" + aktuell.auswahlCtext + "><" + aktuell.auswahlCnum + "><" + aktuell.auswahlDtext + "><" + aktuell.auswahlDnum + "><" + aktuell.auswahlEtext + "><" + aktuell.auswahlEnum + ">"}
        else if (aktuell.anzahl == 6) {var EINTRAG = "<choice><" + aktuell.anzahl + "><" + aktuell.auswahlAtext + "><" + aktuell.auswahlAnum + "><" + aktuell.auswahlBtext + "><" + aktuell.auswahlBnum + "><" + aktuell.auswahlCtext + "><" + aktuell.auswahlCnum + "><" + aktuell.auswahlDtext + "><" + aktuell.auswahlDnum + "><" + aktuell.auswahlEtext + "><" + aktuell.auswahlEnum + "><" + aktuell.auswahlFtext + "><" + aktuell.auswahlFnum + ">"}
        else if (aktuell.anzahl == 7) {var EINTRAG = "<choice><" + aktuell.anzahl + "><" + aktuell.auswahlAtext + "><" + aktuell.auswahlAnum + "><" + aktuell.auswahlBtext + "><" + aktuell.auswahlBnum + "><" + aktuell.auswahlCtext + "><" + aktuell.auswahlCnum + "><" + aktuell.auswahlDtext + "><" + aktuell.auswahlDnum + "><" + aktuell.auswahlEtext + "><" + aktuell.auswahlEnum + "><" + aktuell.auswahlFtext + "><" + aktuell.auswahlFnum + "><" + aktuell.auswahlGtext + "><" + aktuell.auswahlGnum + ">"}
        else if (aktuell.anzahl == 8) {var EINTRAG = "<choice><" + aktuell.anzahl + "><" + aktuell.auswahlAtext + "><" + aktuell.auswahlAnum + "><" + aktuell.auswahlBtext + "><" + aktuell.auswahlBnum + "><" + aktuell.auswahlCtext + "><" + aktuell.auswahlCnum + "><" + aktuell.auswahlDtext + "><" + aktuell.auswahlDnum + "><" + aktuell.auswahlEtext + "><" + aktuell.auswahlEnum + "><" + aktuell.auswahlFtext + "><" + aktuell.auswahlFnum + "><" + aktuell.auswahlGtext + "><" + aktuell.auswahlGnum + "><" + aktuell.auswahlHtext + "><" + aktuell.auswahlHnum + ">"}
        else if (aktuell.anzahl == 9) {var EINTRAG = "<choice><" + aktuell.anzahl + "><" + aktuell.auswahlAtext + "><" + aktuell.auswahlAnum + "><" + aktuell.auswahlBtext + "><" + aktuell.auswahlBnum + "><" + aktuell.auswahlCtext + "><" + aktuell.auswahlCnum + "><" + aktuell.auswahlDtext + "><" + aktuell.auswahlDnum + "><" + aktuell.auswahlEtext + "><" + aktuell.auswahlEnum + "><" + aktuell.auswahlFtext + "><" + aktuell.auswahlFnum + "><" + aktuell.auswahlGtext + "><" + aktuell.auswahlGnum + "><" + aktuell.auswahlHtext + "><" + aktuell.auswahlHnum + "><" + aktuell.auswahlItext + "><" + aktuell.auswahlInum + ">"}
        else {var EINTRAG = aktuell.anzahl}
    }
// ############## Gold erhalten ##############
    if (aktuell.type == "Gold") { var EINTRAG = "<gold><" + aktuell.gold + "><" + aktuell.nex + ">"}
// ############## Erfahrung erhalten ##############
    if (aktuell.type == "Exp") { var EINTRAG = "<exp><" + aktuell.Exp + "><" + aktuell.nex + ">"}
// ############## Heilung erhalten ##############
    if (aktuell.type == "Heilen") { var EINTRAG = "<heal><" + aktuell.Para + "><" + aktuell.Wert + "><" + aktuell.nex + ">"}
// ############## Schaden erhalten ##############
    if (aktuell.type == "Schaden") { var EINTRAG = "<dmg><" + aktuell.Dmg + "><" + aktuell.nex + ">"}
// ############## Attributsprobe ##############
    if (aktuell.type == "Wurf") { var EINTRAG = "<dice><" + aktuell.DiceA + "><" + aktuell.DiceB + "><" + aktuell.DiceC + "><" + aktuell.HG + "><" + aktuell.nexA + "><" + aktuell.nexB + ">"; var dice = true}
// ############## Abenteuer Überprüfung ##############
    if (aktuell.type == "Abenteuer") { var EINTRAG = "<adv><" + aktuell.Wert + "><"+ aktuell.msgA + "><"+ aktuell.nexA + "><" + aktuell.msgB + "><" + aktuell.nexB + ">"; var abenteuer = true}
// ############## Spiel verloren ##############
    if (aktuell.type == "Lose") { var EINTRAG = "<lose>"}
// ############## Spiel verloren ##############
    if (aktuell.type == "Win") { var EINTRAG = "<win>"}
// ############## Zeit steuern ##############
    if (aktuell.type == "Zeit steuern") { var EINTRAG = "<timer><" + aktuell.Ctr + "><" + aktuell.Zeit + "><" + aktuell.nex + ">"}
// ############## Zeitkontrolle ##############
    if (aktuell.type == "Zeitkontrolle") { var EINTRAG = "<timer><ctr><" + aktuell.nexA + "><" + aktuell.nexB + ">"}
// ############## Schalter steuern ##############
    if (aktuell.type == "Schalter steuern") { var EINTRAG = "<switch><set><" + aktuell.ID + "><" + aktuell.Ctr + "><" + aktuell.nex + ">"}
// ############## Schalterkontrolle ##############
    if (aktuell.type == "Schalterkontrolle") { var EINTRAG = "<switch><if><" + aktuell.ID + "><" + aktuell.nexA + "><" + aktuell.nexB + ">"}
// ############## Punkte steuern ##############
    if (aktuell.type == "Punkte steuern") { var EINTRAG = "<point><" + aktuell.Ctr + "><" + aktuell.ID + "><" + aktuell.Wert + "><" + aktuell.nex + ">"}
// ############## Punktekontrolle ##############
    if (aktuell.type == "Punktekontrolle") { var EINTRAG = "<point><goal><" + aktuell.ID + "><" + aktuell.Goal + "><" + aktuell.nexA + "><" + aktuell.nexB + ">"}
// ############## Hintergrundmusik ##############
    if (aktuell.type == "BGM") { var EINTRAG = "<bgm><" + aktuell.bgm + "><" + aktuell.nex + ">"; Sounds_Raw.push(aktuell.bgm)}
// ############## Hintergrundgrafik ##############
    if (aktuell.type == "BGP") { var EINTRAG = "<bgp><" + aktuell.bgp + "><" + aktuell.nex + ">"; Grafiken_Raw.push(aktuell.bgp)}
// ############## Item erhalten ##############
    if (aktuell.type == "Item") { var EINTRAG = "<item><" + aktuell.Item + "><" + aktuell.nex + ">"}
// ############## Kampf ##############
    if (aktuell.type == "Kampf") { var EINTRAG = "<fight><" + aktuell.Mob + "><" + aktuell.nexA + "><" + aktuell.nexB + "><" + aktuell.nexC  + ">"; var kampf = true; Mobs_Raw.push(aktuell.Mob) }
// ############## Klasse ##############
    if (aktuell.type == "Klasse") { var EINTRAG = "<class><" + aktuell.Barde + "><" + aktuell.Dieb + "><" + aktuell.Kleriker + "><" + aktuell.Krieger + "><" + aktuell.Waldlaufer + "><" + aktuell.Magier + "><" + aktuell.Monch + ">"}
// ############## Pantheon ##############
    if (aktuell.type == "Pantheon") { var EINTRAG = "<pantheon><" + aktuell.Aegir + "><" + aktuell.Balder + "><" + aktuell.Forseti + "><" + aktuell.Freya + "><" + aktuell.Freyr + "><" + aktuell.Frigg + "><" + aktuell.Heimdall + "><" + aktuell.Hel + "><" + aktuell.Hermodr + "><" + aktuell.Loki + "><" + aktuell.Njord + "><" + aktuell.Odin + "><" + aktuell.Odur + "><" + aktuell.Sif + "><" + aktuell.Skadi + "><" + aktuell.Surtur + "><" + aktuell.Thor + "><" + aktuell.Thrym + "><" + aktuell.Tyr + "><" + aktuell.Uller + ">"}
// ############## Volk ##############
    if (aktuell.type == "Volk") { var EINTRAG = "<race><" + aktuell.Mensch + "><" + aktuell.Elf + "><" + aktuell.Zwerg + "><" + aktuell.Ork + "><" + aktuell.Gnom + "><" + aktuell.Goblin + "><" + aktuell.Teufelsbrut + "><" + aktuell.Lichtgehullt + "><" + aktuell.Vampir + "><" + aktuell.Lycanthrop + "><" + aktuell.Echsenmensch + "><" + aktuell.Halbelf + "><" + aktuell.Halbork + ">"}
// ############## Herkunft ##############
    if (aktuell.type == "Herkunft") { var EINTRAG = "<origin><" + aktuell.Gebirge + "><" + aktuell.Kuste + "><" + aktuell.Land + "><" + aktuell.Normade + "><" + aktuell.Stadt + "><" + aktuell.Wald + ">"}
// ############## Zufall ##############
    if (aktuell.type == "Zufall") { var EINTRAG = "<random><" + aktuell.NexA + "><" + aktuell.NexB + "><" + aktuell.NexC + "><" + aktuell.NexD + "><" + aktuell.NexE + "><" + aktuell.NexF + "><" + aktuell.NexG + "><" + aktuell.NexH + "><" + aktuell.NexI + "><" + aktuell.NexJ + ">"}





    if (typeof EINTRAG !== 'undefined' && EINTRAG.includes('undefined')) {FEHLER.push(i + 1)}
    if (typeof EINTRAG !== 'undefined' && EINTRAG.includes('<>')) {FEHLER.push(i + 1)}
    var GAME = GAME + EINTRAG + "\n";
  }

let Sounds = Array.from(new Set(Sounds_Raw));
let Grafiken = Array.from(new Set(Grafiken_Raw));
let Mobs = Array.from(new Set(Mobs_Raw));


    var Sounds_List = "";
    for (let i = 0; i < Sounds.length; i++) {
        if (typeof Sounds !== 'undefined') {
            var Sounds_List = Sounds_List + Sounds[i] + ".ogg --> \n"
        }
    }
    var Grafiken_List = "";
    for (let i = 0; i < Grafiken.length; i++) {
        if (typeof Grafiken !== 'undefined') {
            var Grafiken_List = Grafiken_List + Grafiken[i] + ".png --> \n"
        }
    }
    var Mobs_List = "";
    for (let i = 0; i < Mobs.length; i++) {
        if (typeof Mobs !== 'undefined') {
            var Mobs_List = Mobs_List + Mobs[i] + ".png --> \n"
        }
    }

    if (FEHLER.length === 0){
              let controllJSON = {
                  folder : zufall,
                  author : author.val().replace(/[\n<>"]/g, " "),
                  usefights : kampf,
                  useadventure : abenteuer,
                  usedicerolls : dice,
                  GER : true,
                  GER_NAME : titel.val().replace(/[\n<>"]/g, " "),
                  GER_DESC : beschreibung.val().replace(/[\n<>"]/g, " "),
                  ENG : false,
                  ENG_NAME : "",
                  ENG_DESC : ""
               }
            let Ressourcen = "---------- Author ---------- \n" + author.val().replace(/[\n<>"]/g, " ") +" \n\n---------- Sounddateien ---------- \n" + Sounds_List + "\n\n" + "---------- Grafiken ----------\n" + Grafiken_List + "\n\n" + "---------- Monstergrafiken ----------\n" + Mobs_List
        var jsonContent = JSON.stringify(controllJSON);
        var zip = new JSZip();
        var folder = zip.folder(zufall);
        folder.file("1.txt", GAME);
        zip.file(zufall + ".json", jsonContent);
        folder.file("Credits.txt", Ressourcen);
        zip.generateAsync({ type: "blob" })
          .then(function (blob) {
            var downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = controllJSON.GER_NAME + ".zip";
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
          })
          .then(function() {
            window.localStorage.setItem("user", JSON.stringify(user));

          });
    } else {
        alert("Fehler bei den Einträgen:\n" + FEHLER)
    }
            let user = {
                  author : author.val().replace(/[\n<>"]/g, " "),
                  titel : titel.val().replace(/[\n<>"]/g, " "),
                  beschreibung : beschreibung.val().replace(/[\n<>"]/g, " ")
            }
            window.localStorage.setItem("user", JSON.stringify(user));
            dialog.remove();
setTimeout(function() {
            location.reload();
}, 1000);
           });
  let cancelButton = $("<button>Abbrechen</button>").appendTo(dialog);
  cancelButton.click(function() {
      let user = {
          author : author.val().replace(/[\n<>"]/g, " "),
          titel : titel.val().replace(/[\n<>"]/g, " "),
          beschreibung : beschreibung.val().replace(/[\n<>"]/g, " ")
      }

  });
  $("body > div").not(dialog).remove();
}
function addNew() {
    let dialog = $("<div></div>").css({
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "20px",
      border: "1px solid black",
      "border-radius": "5px",
      overflow: "auto",
      maxHeight: "90vh" 
    }).appendTo("body");
           $("<span><h2>Dialoge:  </h2></span>").appendTo(dialog);
          let Nachricht = $("<button>Nachricht</button>").appendTo(dialog);
          Nachricht.click(function() {addEntry('Nachricht'); });
          let Auswahlfenster = $("<button>Auswahlfenster</button>").appendTo(dialog);
          Auswahlfenster.click(function() {addEntry('Auswahl'); });
          $("<br><br>").appendTo(dialog); 
          $("<span><h2>Erhalten:  </h2></span>").appendTo(dialog);
          let Gold = $("<button>Gold</button>").appendTo(dialog);
          Gold.click(function() {addEntry('Gold'); });
          let Exp = $("<button>Erfahrung</button>").appendTo(dialog);
          Exp.click(function() {addEntry('Exp'); });
          let Item = $("<button>Item</button>").appendTo(dialog);
          Item.click(function() {addEntry('Item'); });
          $("<br>").appendTo(dialog); 
          $("<span><h2>Leben:  </h2></span>").appendTo(dialog);
          let Heilen = $("<button>Heilen</button>").appendTo(dialog);
          Heilen.click(function() {addEntry('Heilen'); });
          let Verlieren = $("<button>Verlieren</button>").appendTo(dialog);
          Verlieren.click(function() {addEntry('Schaden'); });
          $("<br>").appendTo(dialog); 
          $("<span><h2>Szene:  </h2></span>").appendTo(dialog);
          let Musik = $("<button>Musik</button>").appendTo(dialog);
          Musik.click(function() {addEntry('BGM'); });
          let Bild = $("<button>Bild</button>").appendTo(dialog);
          Bild.click(function() {addEntry('BGP'); });
          $("<br>").appendTo(dialog); 
          $("<span><h2>Aktion:  </h2></span>").appendTo(dialog);
          let Kampf = $("<button>Kampf</button>").appendTo(dialog);
          Kampf.click(function() {addEntry('Kampf'); });
          let Wurf = $("<button>Würfeln</button>").appendTo(dialog);
          Wurf.click(function() {addEntry('Wurf'); });
          let Abenteuer = $("<button>Abenteuer</button>").appendTo(dialog);
          Abenteuer.click(function() {addEntry('Abenteuer'); });
          $("<br>").appendTo(dialog); 
          $("<span><h2>Spielfluss:  </h2></span>").appendTo(dialog);
          let ZeitA = $("<button>Zeit steuern</button>").appendTo(dialog);
          ZeitA.click(function() {addEntry('Zeit steuern'); });
          let ZeitB = $("<button>Zeitkontrolle</button>").appendTo(dialog);
          ZeitB.click(function() {addEntry('Zeitkontrolle'); });
          let SchalterA = $("<button>Schalter steuern</button>").appendTo(dialog);
          SchalterA.click(function() {addEntry('Schalter steuern'); });
          let SchalterB = $("<button>Schalterkontrolle</button>").appendTo(dialog);
          SchalterB.click(function() {addEntry('Schalterkontrolle'); });
          let PunkteA = $("<button>Punkte steuern</button>").appendTo(dialog);
          PunkteA.click(function() {addEntry('Punkte steuern'); });
          let PunkteB = $("<button>Punktekontrolle</button>").appendTo(dialog);
          PunkteB.click(function() {addEntry('Punktekontrolle'); });
          $("<br>").appendTo(dialog); 
          let Klasse = $("<button>Klasse</button>").appendTo(dialog);
          Klasse.click(function() {addEntry('Klasse'); });
          let Pantheon = $("<button>Pantheon</button>").appendTo(dialog);
          Pantheon.click(function() {addEntry('Pantheon'); });
          let Volk = $("<button>Volk</button>").appendTo(dialog);
          Volk.click(function() {addEntry('Volk'); });
          let Herkunft = $("<button>Herkunft</button>").appendTo(dialog);
          Herkunft.click(function() {addEntry('Herkunft'); });
          let Zufall = $("<button>Zufall</button>").appendTo(dialog);
          Zufall.click(function() {addEntry('Zufall'); });
          $("<br>").appendTo(dialog); 
          $("<span><h2>Beenden:  </h2></span>").appendTo(dialog);
          let Lose = $("<button>Spiel verloren</button>").appendTo(dialog);
          Lose.click(function() {addEntry('Lose'); });
          let Win = $("<button>Spiel gewonnen</button>").appendTo(dialog);
          Win.click(function() {addEntry('Win'); });

  $("body > div").not(dialog).remove();
}
function TestStart() {
  let TEST = {
    ID : 1,
    BGM: "Keines",
    BGS: "Keinen"
    }
    window.localStorage.setItem("TEST", JSON.stringify(TEST));
    TestPlay()
};

function TestPlay() {
    let dialog = $("<div></div>").css({
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "20px",
      border: "1px solid black",
      "border-radius": "5px",
      overflow: "auto",
      maxHeight: "90vh" 
    }).appendTo("body");
          let GAME = JSON.parse(window.localStorage.getItem("entries")) || [];
          let GAME_ID = JSON.parse(window.localStorage.getItem("TEST")) || [];
          let TEST_LINE = GAME[GAME_ID.ID - 1];
          var TEST_ID = GAME_ID.ID;
          var TEST_BGM = GAME_ID.BGM;
          var TEST_BGS = GAME_ID.BGS;
          $("<h1>Test Modus</h1>").appendTo(dialog); //Überschrift     
          $("<span>Sprung nach:</span>").appendTo(dialog);
          let JUMPInput = $("<input type='number' placeholder='0'>").val(TEST_ID).appendTo(dialog);
          let JUMPButton = $("<button>OK</button>").appendTo(dialog);
          JUMPButton.click(function() {
          let GAME_NEW = {
            ID : JUMPInput.val().replace(/[\n<>"]/g, " "),
            BGM: TEST_BGM,
            BGS: TEST_BGS
          }
          window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
          TestPlay()
          });
          $("<br><hr>").appendTo(dialog);  
          $("<span>Aktuelle Zeile:</span>" + TEST_ID + "<span><br>Hintergrundgrafik:</span>" + TEST_BGM + "<span><br>Hintergrundmusik:</span>" + TEST_BGS + "<br><hr><br>").appendTo(dialog);
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//            Testanzeige
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ############## Gelöschter Eintrag ##############
// ############## Nachricht-Fenster ##############
        if (TEST_LINE.type == "Gelöscht"){
          $("<span><b>Gelöschter Eintrag</b></span><br>").appendTo(dialog);
        }
// ############## Nachricht-Fenster ##############
        if (TEST_LINE.type === "Nachricht"){
          $("<span><b>Textnachricht:</b></span><br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          $("<span>" + TEST_LINE.msg + "</span>").appendTo(dialog);
          $("<br><br>").appendTo(dialog); 
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Auswahl-Fenster ##############
        if (TEST_LINE.type == "Auswahl"){
          $("<span><b>Auswahlfenster:</b></span><br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          if (TEST_LINE.anzahl >= 1){
              let WEITERButtonA = $("<button>" + TEST_LINE.auswahlAtext+"</button>").appendTo(dialog);
              WEITERButtonA.click(function() {
                  let GAME_NEW = {
                    ID : TEST_LINE.auswahlAnum,
                    BGM: TEST_BGM,
                    BGS: TEST_BGS
                  }
                  window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
                  TestPlay()
                })
              $("<br>").appendTo(dialog); 
          }

          if (TEST_LINE.anzahl >= 2){
              let WEITERButtonB = $("<button>" + TEST_LINE.auswahlBtext+"</button>").appendTo(dialog);
              WEITERButtonB.click(function() {
                  let GAME_NEW = {
                    ID : TEST_LINE.auswahlBnum,
                    BGM: TEST_BGM,
                    BGS: TEST_BGS
                  }
                  window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
                  TestPlay()
                })
              $("<br>").appendTo(dialog); 
          }
          if (TEST_LINE.anzahl >= 3){
              let WEITERButtonC = $("<button>" + TEST_LINE.auswahlCtext+"</button>").appendTo(dialog);
              WEITERButtonC.click(function() {
                  let GAME_NEW = {
                    ID : TEST_LINE.auswahlCnum,
                    BGM: TEST_BGM,
                    BGS: TEST_BGS
                  }
                  window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
                  TestPlay()
                })
              $("<br>").appendTo(dialog); 
          }
          if (TEST_LINE.anzahl >= 4){
              let WEITERButtonD = $("<button>" + TEST_LINE.auswahlDtext+"</button>").appendTo(dialog);
              WEITERButtonD.click(function() {
                  let GAME_NEW = {
                    ID : TEST_LINE.auswahlDnum,
                    BGM: TEST_BGM,
                    BGS: TEST_BGS
                  }
                  window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
                  TestPlay()
                })
              $("<br>").appendTo(dialog); 
          }
          if (TEST_LINE.anzahl >= 5){
              let WEITERButtonE = $("<button>" + TEST_LINE.auswahlEtext+"</button>").appendTo(dialog);
              WEITERButtonE.click(function() {
                  let GAME_NEW = {
                    ID : TEST_LINE.auswahlEnum,
                    BGM: TEST_BGM,
                    BGS: TEST_BGS
                  }
                  window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
                  TestPlay()
                })
              $("<br>").appendTo(dialog); 
          }
          if (TEST_LINE.anzahl >= 6){
              let WEITERButtonF = $("<button>" + TEST_LINE.auswahlFtext+"</button>").appendTo(dialog);
              WEITERButtonF.click(function() {
                  let GAME_NEW = {
                    ID : TEST_LINE.auswahlFnum,
                    BGM: TEST_BGM,
                    BGS: TEST_BGS
                  }
                  window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
                  TestPlay()
                })
              $("<br>").appendTo(dialog); 
          }
          if (TEST_LINE.anzahl >= 7){
              let WEITERButtonG = $("<button>" + TEST_LINE.auswahlGtext+"</button>").appendTo(dialog);
              WEITERButtonG.click(function() {
                  let GAME_NEW = {
                    ID : TEST_LINE.auswahlGnum,
                    BGM: TEST_BGM,
                    BGS: TEST_BGS
                  }
                  window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
                  TestPlay()
                })
              $("<br>").appendTo(dialog); 
          }
          if (TEST_LINE.anzahl >= 8){
              let WEITERButtonH = $("<button>" + TEST_LINE.auswahlHtext+"</button>").appendTo(dialog);
              WEITERButtonH.click(function() {
                  let GAME_NEW = {
                    ID : TEST_LINE.auswahlHnum,
                    BGM: TEST_BGM,
                    BGS: TEST_BGS
                  }
                  window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
                  TestPlay()
                })
              $("<br>").appendTo(dialog); 
          }
          if (TEST_LINE.anzahl >= 9){
              let WEITERButtonI = $("<button>" + TEST_LINE.auswahlItext+"</button>").appendTo(dialog);
              WEITERButtonI.click(function() {
                  let GAME_NEW = {
                    ID : TEST_LINE.auswahlInum,
                    BGM: TEST_BGM,
                    BGS: TEST_BGS
                  }
                  window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
                  TestPlay()
                })
              $("<br>").appendTo(dialog); 
          }
              $("<br>").appendTo(dialog); 
        }
// ############## Gold erhalten ##############
        if (TEST_LINE.type === "Gold"){
          $("<span><b>Gold erhalten:</b></span><br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          $("<span>" + TEST_LINE.gold + " Gold</span>").appendTo(dialog);
          $("<br><br>").appendTo(dialog); 
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Exp erhalten ##############
        if (TEST_LINE.type === "Exp"){
          $("<span><b>Erfahrung erhalten:</b></span><br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          $("<span>" + TEST_LINE.Exp + " Punkte</span>").appendTo(dialog);
          $("<br><br>").appendTo(dialog); 
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Heilung ##############
        if (TEST_LINE.type === "Heilen"){
          $("<span><b>Heilung:</b></span><br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          $("<span>" + TEST_LINE.Wert + TEST_LINE.Para + "</span>").appendTo(dialog);
          $("<br><br>").appendTo(dialog); 
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Schaden erhalten ##############
        if (TEST_LINE.type === "Schaden"){
          $("<span><b>Schaden erhalten:</b></span><br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          $("<span>" + TEST_LINE.Dmg + " Lebenspunkte</span>").appendTo(dialog);
          $("<br><br>").appendTo(dialog); 
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Attributsprobe ##############
        if (TEST_LINE.type === "Wurf"){
          $("<span><b>Attributsprobe</b></span><br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          $("<span>Wurf auf " + TEST_LINE.DiceA + "," + TEST_LINE.DiceB + "," + TEST_LINE.DiceC + " gegen " +  TEST_LINE.HG + "</span>").appendTo(dialog);
          $("<br><br>").appendTo(dialog); 
          let WEITERButtonA = $("<button>Wurf Erfolgreich</button>").appendTo(dialog);
          WEITERButtonA.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexA,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          let WEITERButtonB = $("<button>Wurf Misserfolg</button>").appendTo(dialog);
          WEITERButtonB.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexB,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br><br>").appendTo(dialog); 
        }
// ############## Abenteuer Überprüfung ##############
        if (TEST_LINE.type === "Abenteuer"){
          $("<span><b>Abenteuerüberprüfung:</b></span><br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          var text = ""
          if (TEST_LINE.Wert == "light") {var text = "Lichtquelle"}
          else if (TEST_LINE.Wert == "magic") {var text = "Magie entdecken"}
          else if (TEST_LINE.Wert == "bind") {var text = "Fesseln"}
          else if (TEST_LINE.Wert == "fall") {var text = "Herunterfallen"}
          else if (TEST_LINE.Wert == "mind") {var text = "Gedanken lesen"}
          else if (TEST_LINE.Wert == "lang-dwarvish") {var text = "Sprache verstehen - Zwergisch"}
          else if (TEST_LINE.Wert == "lang-sylvan") {var text = "Sprache verstehen - Sylvanisch"}
          else if (TEST_LINE.Wert == "lang-orc") {var text = "Sprache verstehen - Orkisch"}
          else if (TEST_LINE.Wert == "lang-gnomish") {var text = "Sprache verstehen - Gnomisch"}
          else if (TEST_LINE.Wert == "lang-draconic") {var text = "Sprache verstehen - Drakonisch"}
          else if (TEST_LINE.Wert == "lang-infernal") {var text = "Sprache verstehen - Infernal"}
          else if (TEST_LINE.Wert == "lang-celestial") {var text = "Sprache verstehen - Celestisch"}
          else if (TEST_LINE.Wert == "lang-primordial") {var text = "Sprache verstehen - Urtümlich"}
          else if (TEST_LINE.Wert == "lang-giant") {var text = "Sprache verstehen - Riesisch"}
          $("<span>Überprüfung: " + text + "</span> <br>").appendTo(dialog);
          $("<span><b>Zutreffend: </b>" + TEST_LINE.msgA + "<br><b>Nicht zutreffend:</b>" + TEST_LINE.msgB + "</span> <br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          let WEITERButtonA = $("<button>Zutreffend weiter</button>").appendTo(dialog);
          WEITERButtonA.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexA,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          let WEITERButtonB = $("<button>Nicht zutreffend weiter</button>").appendTo(dialog);
          WEITERButtonB.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexB,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Spiel verloren ##############
        if (TEST_LINE.type === "Lose"){
          $("<span><b>Game Over</b></span><br><br><br>").appendTo(dialog);
        }
// ############## Spiel verloren ##############
        if (TEST_LINE.type === "Win"){
          $("<span><b>Spiel gewonnen</b></span><br><br><br>").appendTo(dialog);
        }
// ############## Zeit steuern ##############
        if (TEST_LINE.type === "Zeit steuern"){
          $("<span><b>Zeit steuern</b></span><br>").appendTo(dialog);
          var text = "";
          if (TEST_LINE.Ctr == "set") {var text = "Zeit wird auf " + TEST_LINE.Zeit + " gesetzt"}
          if (TEST_LINE.Ctr == "sub") {var text = "Zeit wird um " + TEST_LINE.Zeit + " reduziert"}
          $("<span>" + text + "</span> <br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Zeitkontrolle ##############
        if (TEST_LINE.type === "Zeitkontrolle"){
          $("<span><b>Zeitkontrolle</b></span><br><br><br>").appendTo(dialog);
          let WEITERButtonA = $("<button>Zeit vorhanden</button>").appendTo(dialog);
          WEITERButtonA.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexA,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br><br>").appendTo(dialog); 
          let WEITERButtonB = $("<button>Keine Zeit vorhanden</button>").appendTo(dialog);
          WEITERButtonB.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexB,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br><br>").appendTo(dialog); 
        }
// ############## Schalter steuern ##############
        if (TEST_LINE.type === "Schalter steuern"){
          $("<span><b>Schalter steuern</b></span><br>").appendTo(dialog);
          var text = "";
          if (TEST_LINE.Ctr == "true") {var text = "Schalter " + TEST_LINE.ID + " wird auf AN gesetzt"}
          if (TEST_LINE.Ctr == "false") {var text = "Schalter " + TEST_LINE.ID + " wird auf AUS reduziert"}
          $("<span>" + text + "</span> <br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Schalterkontrolle ##############
        if (TEST_LINE.type === "Schalterkontrolle"){
          $("<span><b>Schalterkontrolle</b></span><br><br><br>").appendTo(dialog);
          $("<span>Kontrollierender Schalter:" + TEST_LINE.ID + "</span> <br><br>").appendTo(dialog);
          let WEITERButtonA = $("<button>Wenn Schalter AN</button>").appendTo(dialog);
          WEITERButtonA.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexA,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          let WEITERButtonB = $("<button>Wenn Schalter AUS</button>").appendTo(dialog);
          WEITERButtonB.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexB,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br><br>").appendTo(dialog); 
        }
// ############## Punkte steuern ##############
        if (TEST_LINE.type === "Punkte steuern"){
          $("<span><b>Punkte steuern</b></span><br>").appendTo(dialog);
          var text = "";
          if (TEST_LINE.Ctr == "set") {var text = "Punktespeicher " + TEST_LINE.ID + " wirf auf " + TEST_LINE.Wert + " gesetzt"}
          if (TEST_LINE.Ctr == "sub") {var text = "Punktespeicher " + TEST_LINE.ID + " wird um " + TEST_LINE.Wert + " verringert"}
          if (TEST_LINE.Ctr == "add") {var text = "Punktespeicher " + TEST_LINE.ID + " wird um " + TEST_LINE.Wert + " erhöht"}
          $("<span>" + text + "</span> <br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Punktekontrolle ##############
        if (TEST_LINE.type === "Punktekontrolle"){
          $("<span><b>Punktekontrolle</b></span><br><br><br>").appendTo(dialog);
          $("<span>Kontrolle ob Punktespeicher " + TEST_LINE.ID + " gleich oder mehr als " + TEST_LINE.Goal + " ist</span> <br><br>").appendTo(dialog);
          let WEITERButtonA = $("<button>Wenn Genügend</button>").appendTo(dialog);
          WEITERButtonA.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexA,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          let WEITERButtonB = $("<button>Wenn Ungenügend</button>").appendTo(dialog);
          WEITERButtonB.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexB,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br><br>").appendTo(dialog); 
        }
// ############## BGM ##############
        if (TEST_LINE.type === "BGM"){
          $("<span><b>Hintergrundmusik:</b></span><br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          $("<span>Hintergrundmusik wurde geändert</span>").appendTo(dialog);
          $("<br><br>").appendTo(dialog); 
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_BGM,
                BGS: TEST_LINE.bgm
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## BGP ##############
        if (TEST_LINE.type === "BGP"){
          $("<span><b>Hintergrundbild:</b></span><br>").appendTo(dialog);
          $("<br>").appendTo(dialog); 
          $("<span>Hintergrundgrafik wurde geändert</span>").appendTo(dialog);
          $("<br><br>").appendTo(dialog); 
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_LINE.bgp,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Item erhalten ##############
        if (TEST_LINE.type === "Item"){
          $("<span><b>Gegenstand erhalten</b></span><br><br>").appendTo(dialog);
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nex,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }
// ############## Kampf ##############
        if (TEST_LINE.type === "Kampf"){
          $("<span><b>Kampf</b></span><br><br>").appendTo(dialog);
          let WEITERButtonA = $("<button>Gewonnen</button>").appendTo(dialog);
          WEITERButtonA.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexA,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonB = $("<button>Flucht</button>").appendTo(dialog);
          WEITERButtonB.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexB,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonC = $("<button>Verloren</button>").appendTo(dialog);
          WEITERButtonC.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.nexC,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br><br>").appendTo(dialog); 
        }
// ############## Klasse ##############
        if (TEST_LINE.type === "Klasse"){
          $("<span><b>Klassenunterscheidung</b></span><br><br>").appendTo(dialog);
          let WEITERButtonA = $("<button>Spieler ist Barde</button>").appendTo(dialog);
          WEITERButtonA.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Barde,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonB = $("<button>Spieler ist Dieb</button>").appendTo(dialog);
          WEITERButtonB.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Dieb,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonC = $("<button>Spieler ist Kleriker</button>").appendTo(dialog);
          WEITERButtonC.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Kleriker,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonD = $("<button>Spieler ist Krieger</button>").appendTo(dialog);
          WEITERButtonD.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Krieger,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonE = $("<button>Spieler ist Waldläufer</button>").appendTo(dialog);
          WEITERButtonE.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Waldlaufer,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonF = $("<button>Spieler ist Magier</button>").appendTo(dialog);
          WEITERButtonF.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Magier,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonG = $("<button>Spieler ist Mönch</button>").appendTo(dialog);
          WEITERButtonG.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Monch,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br><br>").appendTo(dialog); 
        }
// ############## Pantheon ##############
        if (TEST_LINE.type === "Pantheon"){
          $("<span><b>Pantheonunterscheidung</b></span><br><br>").appendTo(dialog);
          let WEITERButtonA = $("<button>Spieler glaubt an Aegir</button>").appendTo(dialog);
          WEITERButtonA.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Aegir,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonB = $("<button>Spieler glaubt an Balder </button>").appendTo(dialog);
          WEITERButtonB.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Balder,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonC = $("<button>Spieler glaubt an Forseti </button>").appendTo(dialog);
          WEITERButtonC.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Forseti,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonD = $("<button>Spieler glaubt an Freya </button>").appendTo(dialog);
          WEITERButtonD.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Freya,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonE = $("<button>Spieler glaubt an Freyr </button>").appendTo(dialog);
          WEITERButtonE.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Freyr,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonF = $("<button>Spieler glaubt an Frigg </button>").appendTo(dialog);
          WEITERButtonF.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Frigg,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonG = $("<button>Spieler glaubt an Heimdall </button>").appendTo(dialog);
          WEITERButtonG.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Heimdall,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonH = $("<button>Spieler glaubt an Hel </button>").appendTo(dialog);
          WEITERButtonH.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Hel,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonI = $("<button>Spieler glaubt an Hermodr </button>").appendTo(dialog);
          WEITERButtonI.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Hermodr,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonJ = $("<button>Spieler glaubt an Loki </button>").appendTo(dialog);
          WEITERButtonJ.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Loki,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonK = $("<button>Spieler glaubt an Njord </button>").appendTo(dialog);
          WEITERButtonK.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Njord,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonL = $("<button>Spieler glaubt an Odin </button>").appendTo(dialog);
          WEITERButtonL.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Odin,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonM = $("<button>Spieler glaubt an Odur </button>").appendTo(dialog);
          WEITERButtonM.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Odur,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonN = $("<button>Spieler glaubt an Sif </button>").appendTo(dialog);
          WEITERButtonN.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Sif,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonO = $("<button>Spieler glaubt an Skadi </button>").appendTo(dialog);
          WEITERButtonO.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Skadi,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonP = $("<button>Spieler glaubt an Surtur </button>").appendTo(dialog);
          WEITERButtonP.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Surtur,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonQ = $("<button>Spieler glaubt an Thor </button>").appendTo(dialog);
          WEITERButtonQ.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Thor,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonR = $("<button>Spieler glaubt an Thrym </button>").appendTo(dialog);
          WEITERButtonR.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Thrym,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonS = $("<button>Spieler glaubt an Tyr </button>").appendTo(dialog);
          WEITERButtonS.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Tyr,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonT = $("<button>Spieler glaubt an Uller </button>").appendTo(dialog);
          WEITERButtonT.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Uller,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
        }
// ############## Volk ##############
        if (TEST_LINE.type === "Volk"){
          $("<span><b>Volksunterscheidung</b></span><br><br>").appendTo(dialog);
          let WEITERButtonA = $("<button>Spieler ist ein Mensch</button>").appendTo(dialog);
          WEITERButtonA.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Mensch,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonB = $("<button>Spieler ist ein Elf</button>").appendTo(dialog);
          WEITERButtonB.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Elf,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonC = $("<button>Spieler ist ein Zwerg</button>").appendTo(dialog);
          WEITERButtonC.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Zwerg,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonD = $("<button>Spieler ist ein Ork</button>").appendTo(dialog);
          WEITERButtonD.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Ork,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonE = $("<button>Spieler ist ein Gnom</button>").appendTo(dialog);
          WEITERButtonE.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Gnom,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonF = $("<button>Spieler ist ein Goblin</button>").appendTo(dialog);
          WEITERButtonF.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Goblin,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonG = $("<button>Spieler ist ein Teufelsbrut</button>").appendTo(dialog);
          WEITERButtonG.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Teufelsbrut,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonH = $("<button>Spieler ist ein Lichtgehüllt</button>").appendTo(dialog);
          WEITERButtonH.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Lichtgehullt,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonI = $("<button>Spieler ist ein Vampir</button>").appendTo(dialog);
          WEITERButtonI.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Vampir,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonJ = $("<button>Spieler ist ein Lycanthrop</button>").appendTo(dialog);
          WEITERButtonJ.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Lycanthrop,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonK = $("<button>Spieler ist ein Echsenmensch</button>").appendTo(dialog);
          WEITERButtonK.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Echsenmensch,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonL = $("<button>Spieler ist ein Halbelf</button>").appendTo(dialog);
          WEITERButtonL.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Halbelf,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonM = $("<button>Spieler ist ein Halbork</button>").appendTo(dialog);
          WEITERButtonM.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Halbork,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
        }
// ############## Herkunft ##############
        if (TEST_LINE.type === "Herkunft"){
          $("<span><b>Herkunftsunterscheidung</b></span><br><br>").appendTo(dialog);
          let WEITERButtonA = $("<button>Spieler vom Gebirge</button>").appendTo(dialog);
          WEITERButtonA.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Gebirge,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonB = $("<button>Spieler vom Küste</button>").appendTo(dialog);
          WEITERButtonB.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Kuste,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonC = $("<button>Spieler vom Land</button>").appendTo(dialog);
          WEITERButtonC.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Land,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonD = $("<button>Spieler vom Normade</button>").appendTo(dialog);
          WEITERButtonD.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Normade,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonE = $("<button>Spieler vom Stadt</button>").appendTo(dialog);
          WEITERButtonE.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Stadt,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br>").appendTo(dialog); 
          let WEITERButtonF = $("<button>Spieler vom Wald</button>").appendTo(dialog);
          WEITERButtonF.click(function() {
              let GAME_NEW = {
                ID : TEST_LINE.Wald,
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
          $("<br><br>").appendTo(dialog);
        }
// ############## Zufall ##############
        if (TEST_LINE.type === "Zufall"){
          $("<span><b>Zufallsereignis</b></span><br><br>").appendTo(dialog);
          let WEITERButton = $("<button>Weiter</button>").appendTo(dialog);
          WEITERButton.click(function() {
             var num = Math.floor(Math.random() * (10 - 0))
             var weiter = [TEST_LINE.NexA, TEST_LINE.NexB, TEST_LINE.NexC, TEST_LINE.NexD, TEST_LINE.NexE, TEST_LINE.NexF, TEST_LINE.NexG, TEST_LINE.NexH, TEST_LINE.NexI, TEST_LINE.NexJ]
              let GAME_NEW = {
                ID : weiter[num],
                BGM: TEST_BGM,
                BGS: TEST_BGS
              }
              window.localStorage.setItem("TEST", JSON.stringify(GAME_NEW));
              TestPlay()
            })
        }




  let cancelButton = $("<button>Zurück zum Editor</button>").appendTo(dialog);
  cancelButton.click(function() {
        dialog.remove();
        location.reload();    
  });
  $("body > div").not(dialog).remove();
}


$("#upload-file-input").change(handleFileSelect);
