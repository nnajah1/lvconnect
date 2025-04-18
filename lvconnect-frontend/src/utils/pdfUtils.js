
export const extractFieldsFromText = (text) => {
    const lines = text.split('\n');
    const fields = [];
    const modifiedLines = [];

    lines.forEach((line) => {
      let match, field;
      if ((match = line.match(/^(.+?):\s*(?:_{2,}|\.\.\.\.)?/))) {
        const label = match[1].trim();
        const name = label.toLowerCase().replace(/[^a-z0-9]/gi, '_');

        field = {
          id: crypto.randomUUID(),
          name,
          label,
          type: 'text',
          required: false,
          // x: 0,
          // y: 0,
          // width: 100,
          // height: 40,
        };

        modifiedLines.push(`${label}: {{${name}}}`);
      } else if ((match = line.match(/^(.+?):\s*\[ \]$/))) {
        const label = match[1].trim();
        const name = label.toLowerCase().replace(/[^a-z0-9]/gi, '_');

        field = {
          id: crypto.randomUUID(),
          name,
          label,
          type: 'checkbox',
          required: false,
          // x: 0,
          // y: 0,
          // width: 100,
          // height: 40,
        };

        modifiedLines.push(`${label}: {{${name}}}`);
      } else if ((match = line.match(/^(.+?):\s*\( \)$/))) {
        const label = match[1].trim();
        const name = label.toLowerCase().replace(/[^a-z0-9]/gi, '_');

        field = {
          id: crypto.randomUUID(),
          name,
          label,
          type: 'radio',
          required: false,
          // x: 0,
          // y: 0,
          // width: 100,
          // height: 40,
        };

        modifiedLines.push(`${label}: {{${name}}}`);
      } else {
        modifiedLines.push(line); 
      }

      if (field) {
        fields.push(field);
      }
    });

    return {
      modifiedText: modifiedLines.join('\n'),
      fields,
    };
  };