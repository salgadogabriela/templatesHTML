<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
	
	public function getTemplates()
	{
		$templates = DB::table('template')->select('templateId as ID', 'name as TemplateName')->get();

		return $templates;
	}

	public function saveNewTemplate(Request $request)
	{
		$name = $request->input('name');
		$content = $request->input('content');

		$id = DB::table('template')->insertGetId(
			['name'=>$name, 'content'=>$content]
		);

		return $id;
	}

	public function updateTemplate($id, $content, $name)
	{
		DB::table('template')
            ->where('id', $id)
            ->update(['content' => $content, 'name' => $name]
        );
	}

	public function searchTemplateToShow($id)
	{
		$templateContent = DB::table('template')->select('content', 'name')->where('templateid',"=", $id)->get();
        return $templateContent;
	}

	public function saveTemplateParameters($id, Request $request)
	{
		$parameters = $request->input('parameters');
		
		foreach ($parameters as $param) {
			DB::table('parameter')->insertGetId(
				['templateId'=>$id, 'name'=>$param]
			);
		}
	}

	public function showParameters($id)
	{
		$parameters = DB::table('parameter')
            ->join('template', 'parameter.templateId', '=', 'template.templateid')
            ->select('template.templateId as templateId', 'parameter.name as parameter', 
            	'template.name as template', 'parameter.parameterId as idparam')
            ->where('template.templateId', '=', $id)
            ->get();

        return $parameters;
	}

	public function saveParametersValues(Request $request, $id)
	{
		$values = $request->input('parametersValues');
		$templateContent = DB::table('template')->select('content')->where('templateid','=',$id);
		$templateParameters = DB::table('parameter')
            ->join('template', 'parameter.templateId', '=', 'template.templateid')
            ->select('template.templateId as templateId', 'parameter.name as parameter',
            	'parameter.parameterId as idparam')
            ->where('template.templateId', '=', $id)->get();

        


        return $templateParameters;


	}
}