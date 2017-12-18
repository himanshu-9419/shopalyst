(function () {
    var app = angular.module("myApp", []);
    app.controller("mainCtrl", ngmodelFunc);
    function ngmodelFunc(DataSvc) {
        var self = this;

        //popup on click
        self.popup = false;
        self.popupItem = "";
        self.showPopUp = function (show, item) {
            self.popup = show;
            self.popupItem = item;
        }
        //popup on click ends

        //view selector
        self.gridView=false;
        self.viewSelector = function () {
            var txt = $(".icon").hasClass('icon-grid') ? 'List' : 'Grid';
            $('.icon').toggleClass('icon-grid');
            $(".label").text(txt);
            self.gridView = !self.gridView;
        }
        //view selector ends        
        
        //pagination setting and logic
        self.pagination=[1,2,3,4,5];
        self.selectedIndex=1;
        self.selectedFilter=[];
        self.paginationFunction=function(page){
            self.selectedIndex = page;
            self.index=(page-1)*self.limit;
            self.fetchResults("",false);
        }
        self.paginationNumberFunction=function (incre){
            let diff = 5;
            if(incre==1){
                if (self.maxPageNumber - self.pagination[4] < 5) {
                    diff = self.maxPageNumber - self.pagination[4];
                }
            }
            else{
                if (self.pagination[0] <= 5) {
                    diff =(self.pagination[0]-1);
                }
                diff*=-1;
            }
            self.pagination = self.pagination.map(elem => elem + diff);
            self.paginationFunction(self.pagination[0]);
        }
        //pagination ends

        //sorting and ordering
        self.sortFields = ['price', 'discount', 'bestsellersRank', 'newArrivalsRank', 'trendingRank', 'categoryRank'];
        self.sortField = self.sortFields[0];
        self.orderFields = ['asc', 'desc'];
        self.orderField = self.orderFields[0];
        self.sortBy = function (field) {
            self.fetchResults('', false)
        }
        self.orderBy = function (field) {
            self.fetchResults('', false)
        }
        //sorting and ordering ends

        //defualt page parameters and setups
        self.index=0;
        self.limit=12;
        self.query='boot';
        self.featuredFacets=[];
        self.appliedFilters=[];
        self.getResults=function($event,metaUpdate,filterRemove){
            self.pagination = [1, 2, 3, 4, 5];
            self.selectedIndex = 1;
            self.fetchResults("",metaUpdate);
            if(filterRemove) self.selectedFilter=[];
        }
        //defualt page parameters and setups ends

        //get data
        self.fetchResults=function($event,metaUpdate){
            self.filterData = self.selectedFilter.filter(elem=>elem.selectedFilter).map(elem=>elem.category+"Filter="+elem.name+"&").join('');
            self.filterData +="sortField="+self.sortField;
            self.filterData += "&sortOrder=" + self.orderField;
            DataSvc.getData(self.index,self.limit,self.query,self.filterData).then(data => { 
                self.items = data.productList;
                self.records = data.numFound;
                self.maxPageNumber=Math.ceil(self.records/self.limit);
                if(metaUpdate==false){}
                else{
                    self.featuredFacets=[];
                        for (let a in data.featuredFacets) {
                            for (var i = 0; i < data.featuredFacets[a].split(',').length; i++) {
                            self.featuredFacets.push({name:data.featuredFacets[a].split(',')[i],category:a,selectedFilter:false});
                        }
                    }
                    self.otherFilters = data.facets;
                }
                
                console.log(data); 
        });
    }
    //get data ends

        
        //filters
        self.addFilter=function (filter,add){
            if (add == 1) {
                if (self.featuredFacets.indexOf(filter)!=-1)self.featuredFacets[self.featuredFacets.indexOf(filter)].selectedFilter=true;
                self.selectedFilter.push(filter);
            }
            else {
                
                self.selectedFilter.splice(self.selectedFilter.indexOf(filter),1);
            }
            console.log(self.selectedFilter)
            self.getResults('',true);           
        }
        self.SelectedCategory = function (category) {
            self.categorySelected = category
        }
        //filters end

        self.getResults();
    }
})()