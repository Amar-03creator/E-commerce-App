import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "../ui/select";
import { Textarea } from "../ui/textarea";

function CommonForm({
  isFormValid = () => true,
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderItemByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || ''

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={event=> setFormData({
              ...formData,
              [getControlItem.name]: event.target.value
            })}
            className="h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-colors"
          />
        );
        break;

      case "select":
        element = (
          <Select onValueChange={(value) => setFormData({
            ...formData,
            [getControlItem.name]: value
          })} value={value}>
            <SelectTrigger className="w-full h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200">
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
            onChange={event=> setFormData({
              ...formData,
              [getControlItem.name]: event.target.value
            })}
            className="min-h-24 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none transition-colors"
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            onChange={event=> setFormData({
              ...formData,
              [getControlItem.name]: event.target.value
            })}
            className="h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-colors"
          />
        );
        break;
    }

    return element;
  }

  return (
    <form autoComplete="off" onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-4 sm:space-y-5">
        {formControls.map((controlItem) => (
          <div className="space-y-2" key={controlItem.name}>
            <label className="text-sm font-medium text-gray-700 block">
              {controlItem.label}
            </label>
            {renderItemByComponentType(controlItem)}
          </div>
        ))}
      </div>
      
      <Button 
        type="submit" 
        disabled={isBtnDisabled}
        className={`w-full h-10 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 ${
          isBtnDisabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-lg hover:shadow-blue-500/25'
        }`}
      >
        {buttonText || 'Submit'}
      </Button>
    </form>
  );
}

export default CommonForm;