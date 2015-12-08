class PointsofinterestController < ApplicationController
  def create
    parameters = JSON.parse(params[:ajax_parameters].to_json)
    poi = PointOfInterest.new(name: parameters['name'],
                        latitude: parameters['lat'],
                        longitude: parameters['lng'],
                        address: parameters['address'])
    
    if(poi.save)
      render(json: poi, status: 201)
    else
      render(status: 400)
    end
  end

  def get
    name = params[:name].split(',')
    poi = PointOfInterest.where("name LIKE '%#{name[0]}%'").first
    
    render(json: poi)
  end
end