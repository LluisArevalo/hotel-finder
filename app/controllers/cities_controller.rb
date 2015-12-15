class CitiesController < ApplicationController
  def index
    @cities = City.all.order(:name)
  end

  def new
    @city = City.new
  end

  def edit
    @city = City.find_by_id(params[:id])
  end

  def destroy
    city = City.find_by_id(params[:id])

    if city
      city.destroy
    end

    redirect_to(cities_path)
  end

  def create
    @city = City.new(city_params(params))

    if @city.save
      redirect_to(cities_path)
    else
      flash[:alert] = 'Something went wrong, please fill all the fields and try it again'
      render(:new)
    end
  end

  def update
    @city = City.find_by_id(params[:id])

    if @city.update(city_params(params))
      redirect_to(cities_path)
    else
      flash[:alert] = 'Something went wrong, please fill all the fields and try it again'
      render(:edit)
    end
  end

  private
  
  def city_params params
    params.require(:city).permit(:name, :latitude, :longitude)
  end
end