/*global define,dojo,dijit,dojox,buildProject,esri*/

define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dnd/Moveable",
        "dojox/charting/Chart2D",
        "dojox/charting/action2d/Highlight",
        "dojox/charting/action2d/MoveSlice",
        "dojox/charting/action2d/Tooltip",
        "dojox/charting/themes/MiamiNice",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        //	Our Project's classes ---------------------------------------------
        "buildProject/buildProject",
        //	Widget base classes -----------------------------------------------
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        //	Widget template ---------------------------------------------------
        "dojo/text!./templates/ChartingPane.html"
], function (
		declare,
		lang,
		on,
		Moveable,
		Chart2D,
		Highlight,
		MoveSlice,
		Tooltip,
		MiamiNice,
		Query,
		QueryTask,
		buildProject,
		_WidgetBase,
		_TemplatedMixin,
		_WidgetsInTemplateMixin,
		template) {
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		//	summary:
		//		Floating pane that displays a pie chart when users click on
		//		an info grid row.
		//	templateString:	String
		//		HTML template of the widget (imported using dojo/text)
		//	chart:	dojox.charting.Chart2D
		//		Pie chart object
		//	queryTask:	esri.tasks.QueryTask
		//		Query Task used to fetch geometry from a given district id.  This is used on slice clicks.
		//	data:	Object
		//		Data object loaded to populate pie chart.
		//	map:	esri.Map
		//		The application's map object.
		//	config:	Object
		//		The application's configuration object.
		//	infoGrid:	buildProject.InfoGrid
		//		InfoGrid object that will interact with this pane. 
		//			(This should probably be changed to use subscribe/publish functionality in the future)
		templateString : template,
		chart: null,
		queryTask: null,
		data: null,
		map: null,
		config: null,
		infoGrid: null,
		postCreate: function(){
			//	summary:
			//		Runs after the widget is completely formed.
			//	description:
			//		Runs after the widget is completely formed.  Sets up the floating behavior and creates the query task.
			
			var moveable = new Moveable(this.domNode,{handle:this.header});
			
			// Note: The 1 is appended to the entityDistrictUrl to run the query on Districts.
			//	This can be modified to change the layer.  To run query tasks on multiple layers,
			//	new query tasks will have to be constructed.
			this.queryTask = new QueryTask(this.config.entityDistrictUrl + "/2");
		},
		show: function(/*String*/field,/*String*/title,/*Object*/data,/*int*/layerId){
			//	summary:
			//		Displays the charting pane and sets up the pie chart.
			//	field:	String
			//		Statistic field clicked on from the Info Grid.
			//	title:	String
			//		Label for the feature being described in the pie chart.
			//	data:	Object
			//		Data object orginally used by the Info Grid.  This should probably be changed to be fetched dynamically from a servlet.
			//	layerId:	int
			//		Map layer that was identified to for the Info Grid that called this function.
			
			// Show the pane and set its title.
			this.domNode.style.display = "";
			this.titleDiv.innerHTML = title + " " + field + " Results";
			
			var dc = dojox.charting;
			// dojox.charting can be unpredictable, so it is usually cleaner to completely destroy
			//	the object and re-instantiate then adjusting the values.
			if (this.chart){
				this.chart.destroy();
			}
	       this.chart = new Chart2D(this.chartPane);
	        var seriesData = [];
	        
	        // populating random data for each district as listed in the data file.
	        //	TODO: This needs to be changed to use actual data.
	        for (var i=0;i<data.districts.length;i++){
				var y = Math.floor(Math.random()*1000);
				seriesData.push({"text":data.districts[i].id,"y":y,"stroke":"black","tooltip":y});
	        }
	        
	        this.chart.setTheme(MiamiNice).addPlot("default", {
	            type: "Pie",
	            font: "normal normal 8pt Arial",
	            fontColor: "black",
	            labelOffset: -25,
	            radius: 30
	        }).addSeries("SubTest Data", seriesData);
	        var anim_a = new MoveSlice(this.chart, "default");
	        var anim_b = new Highlight(this.chart, "default");
	        var anim_c = new Tooltip(this.chart, "default");
	        
	        this.chart.render();
	        
	        // If the layerId represents the entity layer, this section attaches an event handler to the chart.
	        //	Note that dojox.charting does not handle events like other widgets.
	        if (layerId === 0){
		        this.chart.connectToPlot("default",lang.hitch(this,function(evt){
					if (evt.type === "onclick"){
						
						var query = new Query();
						query.where = "District = '" + evt.chart.series[0].data[evt.index].text + "'";
						query.returnGeometry = true;
						query.outFields = ["District_Name"];
						query.outSpatialReference = this.map.spatialReference;
						
						this.queryTask.execute(query,lang.hitch(this,this.zoomToDistrict),buildProject.displayError);
					}
				}));
	        }
			
			this.data = data;
			
		},
		zoomToDistrict: function(/*esri.tasks.FeatureSet*/ queryResults){
			//	summary:
			//		Zooms in on the district selected after a slice click.
			//	queryResults:	esri.tasks.FeatureSet
			//		Feature Set containing the result of the slice click's Query.
			
			this.map.setExtent(queryResults.features[0].geometry.getExtent(),true);
			
			// Wait for the extent to be changed before showing the new info grid.
			//	This prevents the info window from being out of the map's extent.
			on.once(this.map, "extent-change", lang.hitch(this, function () {
				this.infoGrid.populate(this.map.toScreen(queryResults.features[0].geometry.getExtent().getCenter()),lang.mixin(queryResults,{feature:queryResults.features[0]}));
			}));
		},
		hide: function(){
			//	summary:
			//		Hide this pane.
			this.domNode.style.display = "none";
		}
	});
});