# Tool for converting raw text files to JSON format

input_file_path = 'skills.txt'

output_file_path = 'skills.json'

# Read the input file and write each line in quotation marks to the output file
with open(input_file_path, 'r') as input_file, open(output_file_path, 'w') as output_file:
    for line in input_file:
        # Remove leading and trailing whitespaces from the line
        cleaned_line = line.strip()
        
        # Write the line with quotation marks and comma to the output file
        output_file.write(f'"{cleaned_line}",\n')

print(f'Contents of {input_file_path} have been converted to JSON format and written to {output_file_path}.')