# [Tour Pedia](https://tourpedia.vercel.app)

### This repository is a combination of 
1. General user web platform
2. Administrator web platform
3. Travel agency web platform.
   
<br />

## [General User Platform](https://tourpedia.vercel.app)
Here general users can
* View different categories, countries & places information.
* View different touist spots & popular food items of all places.
* View tour events organized by different travel agencies & enroll it join or save it for later.
* View predefined tour planning of different combination of places & save it for later.
* View blog posts of different places or countries to get an idea of travelling there.
* Search events, tour plans, places or travel agencies by lots of high level filtering options.
  
<br />

## [Adminstrator Platform](https://admintourpedia.vercel.app)
Here administrators can
* Manage, approve or ban tour events hosted by different travel agencies.
* Manage travel agencies, users & guide account to ensure safety of the whole platform.
* Create & manage blog posts for users.
* Create & manage tour plans for users.
* Create & manage country, category & place information from a user friendly interface.

<br />

## [Travel Agency Platform](https://travelagency.vercel.app)
Here travel agencies can
* Create & manage tour events from a user friendly interface.
* Manage & maintain a user friendly travel agency profile.
* Add & manage guides to organize a tour event.

Also this travel agency platform can be used by guides of different travel agencies to view their assigned tour events.

<br />

--------------------------------------------------------------
<br />

## Development Instructions

### Clone Repository:
	git clone https://github.com/rathijitpapon/tourpedia.git
	git checkout dev
	
### Run API Backend:
	cd api
	docker-compose up --build (After Every Code Change)
	docker-compose up (Otherwise)
	
### Run Admin Frontend:
	cd admin
	npm install
	npm run dev
	
### Run Tour Pedia Frontend:
	cd tourpedia
	npm install
	npm run dev
	
### Run Travel Agency Frontend:
	cd travelagency
	npm install
	npm run dev