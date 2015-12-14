class HotelsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @hotels = Hotel.all.order :name
  end

  def new

  end

  def create
    # parameters = JSON.parse(params[:ajax_parameters].to_json)
    # p = generate_new_hotel(parameters)
    
    # hotel = Hotel.new(p)

    # if hotel.save
    #   render(json: hotel, status: :created)
    # else
    #   render(status: :bad_request)
    # end
    
    parameters = generate_new_hotel(params[:hotel])
    hotel = Hotel.new(parameters)

    if hotel.save
      redirect_to(hotels_path)
    else

    end
  end

  def destroy
    hotel = Hotel.find_by_id(params[:id])

    if(hotel)
      hotel.delete
    end

    redirect_to hotels_path
  end

  private

  def generate_new_hotel parameters
    latLng = parameters[:latLng].split
    {
      name: parameters['name'],
      address: parameters['address'],
      latlong: "POINT(#{latLng[0]} #{latLng[1]})"
    }
  end
end
