class Searcher
  def self.search_hotels_around poi_id_array
    hotels = []

    poi_id_array.each do |id|
      poi = PointOfInterest.find_by_id id
      
      poi.find_hotels_around.each do |hotel|
        hotels << hotel
      end
    end

    sort_by_price(select_matching_hotels(hotels, poi_id_array))
  end

  private

  def self.select_matching_hotels hotels, poi_id_array
    percent = poi_id_array.length / 2.0

    filtered = hotels.find_all do |hotel| 
      hotels.count(hotel) >=  percent
    end

    filtered.uniq
  end

  def self.sort_by_price hotels
    hotels.sort! do |a,b|
      a.price.to_f > 0 && b.price.to_f > 0 ? a.price <=> b.price : a.price ? -1 : 1
    end
  end
end