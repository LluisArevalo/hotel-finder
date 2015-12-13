class PointOfInterest < ActiveRecord::Base
  
  scope :by_name, -> (name){ where("name LIKE ?", "%#{name}%") }
  scope :get_by_name, -> (name){ find_by_name(name) }
  
  def find_hotels_around
    geom_point = "POINT(#{self.latitude} #{self.longitude})"
    sql = "SELECT * FROM hotels WHERE ST_DWithin(latlong, '#{geom_point}', 1000)"

    Hotel.find_by_sql(sql)
  end
end
