class HotelsController < ApplicationController
  skip_before_action :verify_authenticity_token
  
  def create
    parameters = JSON.parse(params[:ajax_parameters].to_json)
    p = generate_new_hotel(parameters)
    
    hotel = Hotel.new(p)

    if hotel.save
      render(json: hotel, status: :created)
    else
      render(status: :bad_request)
    end
  end

  private

  def generate_new_hotel parameters
    {
      name: parameters['name'],
      address: parameters['address'],
      latlong: "POINT(#{parameters["lat"]} #{parameters["lng"]})"
    }
  end
end
