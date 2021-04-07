# Tour Pedia


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