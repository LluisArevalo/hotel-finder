class AddAddressToPointOfInterests < ActiveRecord::Migration
  def change
    add_column :point_of_interests, :address, :string
  end
end
