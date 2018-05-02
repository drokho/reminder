var db = window.openDatabase("reminders", "", "Reminders DB", 2*1024*1024);
            
            function insertReminder(id, task, interval, email) {
                db.transaction(function(tx) {
                    tx.executeSql('INSERT INTO Reminders(id, task, interval, email) VALUES (?, ?, ?, ?)', ['NULL', task, interval, email]);
                });
            }
            
            function renderResults(tx, rs) {
                e = $('#current-tasks');
                e.html('');
                for( var i=0; i < rs.rows.length; i++)
                {
                    r = rs.rows.item(i);
                    e.html(e.html() + 'id: ' + r['id'] + ', Task: ' + r['task'] + ', Interval: ' + r['interval'] + ', email: ' + r['email'] + '<br />');
                }
            }
            
            function renderTasks(email) {
                db.transaction(function(tx) {
                    if (!(email === undefined)) {
                        tx.executeSql('SELECT * FROM Reminders WHERE email = ?', [email], renderResults);
                    } else {
                        tx.executeSql('SELECT * FROM Reminders', [], renderResults);
                    }
                });
            }
            
            $(document).ready( function() {
                db.transaction(function(tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Reminders(id INTEGER PRIMARY KEY AUTO INCREMENT, task TEXT, interval FLOAT, email TEXT)', []);
                });
                
                
                $('reminder-form').submit(function() {
                    insertScore($('#task').val(), $('#interval').val(), $('#email').val());
                    
                    
                    renderTasks();
                    return false;
                    
                });
                
                renderTasks();
            });