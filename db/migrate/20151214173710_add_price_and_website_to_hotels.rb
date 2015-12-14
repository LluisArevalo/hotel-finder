class AddPriceAndWebsiteToHotels < ActiveRecord::Migration
  def change
    add_column :hotels, :price, :float
    add_column :hotels, :website, :string
  end
end
