class HotelsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @hotels = Hotel.all.order :name
  end

  def new
    @cities = City.all
  end

  def edit
    @hotel = Hotel.find_by_id(params[:id])
    @cities = City.all
  end

  def create
    parameters = generate_new_hotel(params[:hotel])
    hotel = Hotel.new(parameters)

    if hotel.save
      redirect_to(hotels_path)
    else
      flash[:alert] = 'The hotel already exists'
      render(:new)
      flash[:alert] = ''
    end
  end

  def update
    hotel = Hotel.find_by_id(params[:id])

    if hotel.update(update_hotel(params))
      redirect_to(hotels_path)
    else
      flash[:alert] = 'Something went wrong, please try it again'
      render(:edit)
      flash[:alert] = ''
    end
  end

  def destroy
    hotel = Hotel.find_by_id(params[:id])

    if hotel
      hotel.delete
    end

    redirect_to(hotels_path)
  end

  private

  def generate_new_hotel parameters
    latLng = parameters[:latLng].split
    
    {
      name: parameters['name'],
      address: parameters['address'],
      latlong: "POINT(#{latLng[0]} #{latLng[1]})",
      price: parameters['price'],
      website: parameters['website'],
      city_id: parameters['city_id']
    }
  end

  def update_hotel params
    params.require(:hotel).permit(:price, :website, :city_id)
  end
end
