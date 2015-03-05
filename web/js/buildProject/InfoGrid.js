/*global define, require, dojo,dijit,dojox,esri,buildProject*/
define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/xhr",
        "dojo/dom-construct",
        "dojo/data/ItemFileReadStore",
        "dojox/grid/DataGrid",
        "esri/graphic",
        "esri/InfoTemplate",
        "esri/symbols/SimpleFillSymbol",
        //	Our Project's classes ---------------------------------------------
        "buildProject/buildProject",
        "buildProject/ChartingPane",
        //  Widget base classes -----------------------------------------------
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        //	Widget template ---------------------------------------------------
        "dojo/text!./templates/InfoGrid.html"
], function (
		declare,
		lang,
		xhr,
		domConstruct,
		ItemFileReadStore,
		DataGrid,
		Graphic,
		InfoTemplate,
		SimpleFillSymbol,
		buildProject,
		ChartingPane,
		_WidgetBase,
		_TemplatedMixin,
		_WidgetsInTemplateMixin,
		template) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		//	summary:
		//		Chart to be displayed in the map's InfoWindow.
		//	templateString:	String
		//		HTML template of the widget (imported using dojo/text)
		//	store:	dojo.data.ItemFileReadStore
		//		DataStore used to hold chart information
		//	grid:	dojox.grid.DataGrid
		//		Actual chart widget
		//	identifyResults:	esri.tasks.IdentifyResult[]
		//		An array of results returned by the click to identify
		templateString : template,
		store: null,
		grid: null,
		setup: false,
		identifyResults: null,
		populate: function(/*Event*/clickEvt,/*esri.tasks.IdentifyResult[]*/identifyResults){
			//	summary:
			//		Destroys the old chart and calls for the data object to populate a new one.
			//	clickEvt:	Event
			//		Click event created by click to identify.
			//	identifyResults:	esri.tasks.IdentifyResult[]
			//		Results returned from SiteManager's identify task.
			
			//	Make sure results exist
			if ((identifyResults.length && identifyResults.length > 0) || identifyResults.length === undefined) {
				if (identifyResults[0]){
					this.identifyResults = identifyResults[0];
				} else {
					this.identifyResults = identifyResults;
				}
				this.map.graphics.clear();
				this.map.infoWindow.hide();
				
				//	Destroy the grid and store since dojox is strange.
				if (this.grid){
					this.grid.destroyRecursive();
					delete this.store;
				}
		
				// Call to retrieve sample data.  xhr.get cannot be used on different domains.
				//	If you are using a servlet or data on another server, look into switching to dojo.io.script.
				
				xhr.get({
				    url: require.toUrl("data/sampleData.json"),
				    handleAs: "json",
				    load: lang.partial(dojo.hitch(this,this._finalPopulate),clickEvt),
				    error: buildProject.displayError
				  }, true);
			} else {
				buildProject.displayError("No results were returned from identify.");
			}
		},
		_finalPopulate: function(/*Event*/clickEvt,/*Object*/jsonResults){
			//	summary:
			//		Finishes creating the chart. Called when the data object is returned from the server.
			//	clickEvt:	Event
			//		Click event created by click to identify.
			//	jsonResults:	Object
			//		Data returned from the server.
			
			var data,attr = this.identifyResults.feature.attributes;
			
			// check to see if the layer being identified is an entity.
			//	if it is, set the data to results attached to districts.
			//	otherwise, assign arbitrary data.
			//	TODO: Expand for actual data collected from server.
			
			if (this.identifyResults.layerId === 0){
				 data = jsonResults.entities[attr.dist_region_entity_ENTITY_ID].stats;
				 this.data = jsonResults.entities[attr.dist_region_entity_ENTITY_ID];
			} else {
				data = jsonResults.entities[9110].stats;
				 this.data = jsonResults.entities[9110];
			}
			var obj = {"label":"id",
					"identifier":"id",
					"items":data};
			
			this.store = new ItemFileReadStore({data:obj});
			var layout = [{"field":"id",
				"title":"Field",
				"width":"auto" },
			{ "field":"value",
				"title":"Value",
				"width":"auto" }];
			
			var feature = this.identifyResults.feature;
			
			var graphic = new Graphic(feature.geometry,new SimpleFillSymbol(),feature.attributes,new InfoTemplate({"title":"Identify Results","content":"${*}"}));
			this.map.graphics.add(graphic);
			
			// Setup the infowindow so that it can hold the datagrid.
			var infoWindow = this.map.infoWindow;
			
			infoWindow.setTitle(graphic.attributes[this.identifyResults.displayFieldName]);
			if (!this.setup){
				infoWindow.setContent(this.domNode);
				this.setup = true;
			}
			var screenPt = clickEvt;
			infoWindow.show(screenPt,this.map.getInfoWindowAnchor(screenPt));
			
			this.grid = new DataGrid({
				store: this.store,
				structure: layout,
				canSort: function(){return false;}
			},domConstruct.create("div"));
			
			domConstruct.place(this.gridDomNode,this.domNode);
			this.gridDomNode.appendChild(this.grid.domNode);
			
			this.grid.startup();
			
			// Setup click event behavior.
			this.grid.own(this.grid.on("RowClick", lang.hitch(this, function (evt) {
				var item = this.store._arrayOfAllItems[evt.rowIndex];
				if (!this.chartingPane){
					this.chartingPane = new ChartingPane({"id":"chartingPane","map":this.map,"config":this.config,"infoGrid":this},domConstruct.create('div'));
					document.body.appendChild(this.chartingPane.domNode);
				}
				this.chartingPane.show(this.store.getValue(item,"id"),graphic.attributes[this.identifyResults.displayFieldName],this.data,this.identifyResults.layerId);
			})));
		}
	});
});