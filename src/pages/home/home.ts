import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

declare var WindowsAzure:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  client: any;
  syncContext: any;

  constructor(public platform: Platform) {
    this.platform.ready().then((readySource) => {
      this.client = new WindowsAzure.MobileServiceClient("https://ionic-jsclient-test.azurewebsites.net");
      this.syncContext = this.client.getSyncContext();
      var store = new WindowsAzure.MobileServiceSqliteStore('store.db');
      store.defineTable({
        name: 'TodoItem',
        columnDefinitions: {
            id: 'string',
            test: 'string',
            complete: 'boolean',
        }
      });
      this.syncContext.initialize(store);
    });
  }

  loginWithFacebook(){
    this.client.login("facebook").done(function (results) {
        alert("You are now logged in as: " + results.userId);
    }, function (err) {
        alert("Error: " + err);
    });
  }

  performSyncMethods(){
    var item1 = { test: 'Item 1', complete: false };
    var item2 = { test: 'Item 2', complete: true };
    var item3 = { test: 'Item 3', complete: false };

    this.syncContext.insert("TodoItem", item1);
    this.syncContext.insert("TodoItem", item2);
    this.syncContext.insert("TodoItem", item3);

    this.syncContext.push().then(function(result) {
      alert('success');
    }, function(error) {
      alert(error);
    });
  }

  registerForPush(){
    this.client.push.register("apns", "1111111").then(function(result) {
      alert('success');
    }, function(error) {
      alert(error);
    });
  }

  performTableOperations(){
    var table = this.client.getTable('public'); 
    table.read().then(
      function(results){
        alert(results.length);
      }, 
      function(error){
        alert(error);
      });

    var newItem = { name: 'Mourat'};
    table.insert(newItem).done(
      function (insertedItem) { 
        var id = insertedItem.id;
        alert(id); 
      }, 
      function(error){
        alert(error);
      });

    table.read().then(
      function(results){
        alert(results.length);
      }, 
      function(error){
        alert(error);
      });
  }

}
