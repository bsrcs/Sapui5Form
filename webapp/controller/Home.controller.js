sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
  ],
  function (Controller, History, JSONModel, Fragment) {
    "use strict"

    window.dataStructure = {
      id: "",
      name: "",
      lastName: "",
      email: "",
      country: "Turkey"
    };

    return Controller.extend("workerapp.controller.Home", {

      onInit: function () {
        //runs one time for a view
        //model for the table
        this.tableDataModel = new JSONModel({
          table: [],
        })
        //set the model to the root of the view
        this.getView().setModel(this.tableDataModel, "tableModelPath")
        this.formDataModel = new JSONModel({
          form: dataStructure,
        });
        this.getView().setModel(this.formDataModel, "formModelPath")

        /** Edit Form Model */
        this.editDataModel = new JSONModel({
          form: dataStructure,
        })
        this.getView().setModel(this.editDataModel, "editModelPath")
      },

      ///////////////////////////////////// handleSave /////////////////////////////////////
      handleSave: function () {
        //when the user clicks save get the data from the "form"
        var jsonDataFromView = this.getView()
          .getModel("formModelPath")
          .getData().form
        console.log(
          "data extracted from the form is: " + JSON.stringify(jsonDataFromView)
        )
        /** create new object for each row you are going to create(updating the object) */
        var newObject2 = {
          id: new Date().getTime(),
          name: jsonDataFromView.name,
          lastName: jsonDataFromView.lastName,
          email: jsonDataFromView.email,
          country: jsonDataFromView.country
        };

        var tableDataModelExtracted = this.getView().getModel("tableModelPath")
        var newTableData = tableDataModelExtracted.getData()
        console.log("tableDataModelExtracted: " + JSON.stringify(newTableData))
        //add the data from the form to the array received from the table
        newTableData.table.push(newObject2);
        console.log("new table data : " + JSON.stringify(newTableData))
        //set the new data to the table's data model
        this.getView().getModel("tableModelPath").setData(newTableData)
        //this.getView().byId("myTable").setModel(this.tableDaataModel);
      },

      ///////////////////////////////////// handleEdit /////////////////////////////////////
      handleEdit: function (event) {
        //get the row that was clicked
        var row = event.getSource()
        //get the row data from the table model
        var context = row.getBindingContext("tableModelPath")
        var selectedItem = context.oModel.getProperty(context.sPath)
        console.log("selected Data: " + JSON.stringify(selectedItem))
        // set the data in the correct structure that is expected in the model.
        this.getView().getModel("editModelPath").setData({ form: selectedItem })

        /** Load Fragment */
        var oView = this.getView()
        // create dialog lazily
        if (!this.byId("editDialog")) {
          // load asynchronous XML fragment
          Fragment.load({
            id: oView.getId(),
            name: "workerapp.view.EditDialog",
            controller: this,
          }).then(function (oDialog) {
            // connect dialog to the root view of this component (models, lifecycle)
            oView.addDependent(oDialog)
            oDialog.open()
          })
        } else {
          this.byId("editDialog").open()
        }
      },

      ///////////////////////////////////// onCloseDialog /////////////////////////////////////
      onCloseDialog: function () {
        var editModelData = this.getView().getModel("editModelPath").getData().form;
        var tableModel = this.getView().getModel("tableModelPath");
        var tableList = tableModel.getData().table;
        //modify data and set the new data to the table model
        tableList.forEach(function (item, index) {
          if (item.id == editModelData.id) {
            var newObject = {
              id: editModelData.id,
              name: editModelData.name,
              lastName: editModelData.lastName,
              email: editModelData.email,
              country: editModelData.country
            }
            console.log("index " + index + " was edited!")
            tableList[index] = newObject;
          }
        })
        // set data in right structure
        tableModel.setData({ table: tableList })
        console.log(JSON.stringify(editModelData))
        console.log("editing completed!")
        this.byId("editDialog").close()
      },

      ///////////////////////////////////// handleDelete /////////////////////////////////////
      handleDelete: function (event) {
        //get the row that was clicked
        var row = event.getSource()
        var context = row.getBindingContext("tableModelPath")
        var itemToDelete = context.oModel.getProperty(context.sPath)
        console.log(itemToDelete);
        //set the id to delete in a global variable
        window.idToDelete=itemToDelete.id;
        var oView = this.getView();
        /** Load Fragment */
        // create dialog lazily
        if (!this.byId("deleteDialog")) {
          // load asynchronous XML fragment
          Fragment.load({
            id: oView.getId(),
            controller: this,
            name: "workerapp.view.deleteDialog"
          }).then(function (oDialog) {
            // connect dialog to the root view of this component (models, lifecycle)
            oView.addDependent(oDialog);
            oDialog.open();
          });
        } else {
          this.byId("deleteDialog").open();
        }
      },

      onNoDialog: function () {
        console.log("will not delete!");
        this.byId("deleteDialog").close();
      },

      onYesDialog: function (event) {
        
        var newTableList = [];
        var indexofNewTable = 0;

        // delete the item that is selected
        var tableModel = this.getView().getModel("tableModelPath");
        var tableList = tableModel.getData().table;
        tableList.forEach(function (item, index) {
          if (item.id !== window.idToDelete) {
            newTableList[indexofNewTable++] = item;
          }
        });
        console.log(newTableList);

        // set the updated list to the table model 
        tableModel.setData({ table: newTableList });
        this.byId("deleteDialog").close();
      }

    })
  }
)
