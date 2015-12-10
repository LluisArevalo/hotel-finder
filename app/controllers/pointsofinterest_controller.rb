class PointsofinterestController < ApplicationController
  def create
    parameters = JSON.parse(params[:ajax_parameters].to_json)
    poi = PointOfInterest.new(generate_new_poi(parameters))
    
    if poi.save
      render(json: poi, status: :created)
    else
      render(status: :bad_request)
    end
  end

  def search
    name = params[:name].split(',')[0]
    poi = PointOfInterest.by_name(name).first
    
    render(json: poi, status: :ok)
  end

  def find_hotels_around
    hotels = Searcher.search_hotels_around(params[:ajax_parameters])
    
    render(json: hotels, status: :ok)
  end

  private

  def generate_new_poi parameters
    {
      name: parameters['name'],
      latitude: parameters['lat'],
      longitude: parameters['lng'],
      address: parameters['address']
    }
  end
end