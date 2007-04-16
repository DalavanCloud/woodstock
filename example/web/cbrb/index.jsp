<jsp:root version="2.0" xmlns:f="http://java.sun.com/jsf/core" xmlns:h="http://java.sun.com/jsf/html" xmlns:jsp="http://java.sun.com/JSP/Page" xmlns:webuijsf="http://www.sun.com/webui/webuijsf">
  <jsp:directive.page contentType="text/html" />
  <f:view>
    <!--
      The contents of this file are subject to the terms
      of the Common Development and Distribution License
      (the License).  You may not use this file except in
      compliance with the License.
      
      You can obtain a copy of the license at
      https://woodstock.dev.java.net/public/CDDLv1.0.html.
      See the License for the specific language governing
      permissions and limitations under the License.
      
      When distributing Covered Code, include this CDDL
      Header Notice in each file and include the License file
      at https://woodstock.dev.java.net/public/CDDLv1.0.html.
      If applicable, add the following below the CDDL Header,
      with the fields enclosed by brackets [] replaced by
      you own identifying information:
      "Portions Copyrighted [year] [name of copyright owner]"
      
      Copyright 2007 Sun Microsystems, Inc. All rights reserved.
    -->
    <webuijsf:page >
      <webuijsf:html>
        <f:loadBundle basename="com.sun.webui.jsf.example.resources.Resources" var="msgs" />
        <webuijsf:head title="#{msgs.cbrb_indexTitle}">
	  <webuijsf:link rel="shortcut icon" url="/images/favicon.ico" type="image/x-icon" />
        </webuijsf:head>        
        <webuijsf:body>
           <webuijsf:form id="form1">
               
              <!-- Masthead -->
              <webuijsf:masthead id="Masthead" productImageURL="/images/example_primary_masthead.png"
                productImageDescription="#{msgs.mastheadAltText}" 
                userInfo="test_user"
                serverInfo="test_server" />     
                         
              <!-- Bread Crumb Component -->
              <webuijsf:breadcrumbs id="breadcrumbs">
                <webuijsf:hyperlink actionExpression="#{CheckboxRadiobuttonBean.showExampleIndex}" text="#{msgs.exampleTitle}"
                  onMouseOver="javascript:window.status='#{msgs.index_breadcrumbMouseOver}'; return true;"
                  onMouseOut="javascript: window.status=''; return true" />
                <webuijsf:hyperlink text="#{msgs.cbrb_indexTitle}"/>
              </webuijsf:breadcrumbs>
                       
              <!-- Page Title -->
              <webuijsf:contentPageTitle title="#{msgs.cbrb_indexTitle}" />
              
              <webuijsf:markup tag="div" styleClass="#{themeStyles.CONTENT_MARGIN}">              
                <webuijsf:markup tag="br" singleton="true" />
                
                <!-- Checkbox and Radio button Example link -->
                <webuijsf:markup tag="div" style="padding-bottom: 8px">                     
                    <webuijsf:hyperlink id="cbrbExampleLink" 
                        immediate="true"                    
                        text="#{msgs.cbrb_title}"                   
                        toolTip="#{msgs.cbrb_title}"		    
                        actionExpression="showCheckboxRadiobutton"/>              
                </webuijsf:markup>                               
                
                <!-- Checkbox client-side update example link -->
                 <webuijsf:markup tag="div" style="padding-bottom: 8px">      
                     <webuijsf:hyperlink id="clientSideCbLink"                    
                            immediate="true"  
                            text="#{msgs.cbrb_clientsideCbTitle}"
                            toolTip="#{msgs.cbrb_clientsideCbTitle}"
                            actionExpression="showClinetSideCb" />
                     </webuijsf:markup>     
                     
                    <!-- RadioButton client-side update example link -->
                <webuijsf:hyperlink id="clientSideRbLink"                    
                    immediate="true"  
                    text="#{msgs.cbrb_clientsideRbTitle}"
                    toolTip="#{msgs.cbrb_clientsideRbTitle}"
                    actionExpression="showClinetSideRb" />
              
              </webuijsf:markup>                 
           </webuijsf:form>                          
        </webuijsf:body> 
      </webuijsf:html>  
    </webuijsf:page>
  </f:view>
</jsp:root>                       
