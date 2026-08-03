Split(replace(replace(items('Apply_to_each_2')?['Revision_x0020_Comment'], '>', ','), '<', ','), ',')

Split(Split(


// getting items from value array
items('Apply_to_each_2')?['VALUE']

items()

replace(items('Apply_to_each_2')?['Control_x0020_Number'], ' ', '%20')